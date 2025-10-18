
from rest_framework import status, response
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.viewsets import ModelViewSet
from .models import CustomUser
from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication 
# Create your views here.
class UserViewset(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


    @action(detail=False, methods=['post'])
    def request_otp(self, request):
        """Step 1: Send OTP to user's email"""
        serializer = EmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        user = CustomUser.objects.filter(email=email).first()

        if user:
            if user.is_active:
                return Response(
                    {"message": "User already exists. Please log in."},
                    status=status.HTTP_200_OK,
                )
            else:
                otp = user.generate_otp()
                send_mail(
                    subject="Your Login OTP",
                    message=f"Your OTP code is {otp}. It expires in 5 minutes.",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                     )
                return Response(
                    {"message": "OTP resent to your email."},
                    status=status.HTTP_200_OK,
                )


        user = CustomUser.objects.create(email=email, is_active=False)
        otp = user.generate_otp()
        send_mail(
                    subject="Your Login OTP",
                    message=f"Your OTP code is {otp}. It expires in 5 minutes.",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                     )

        return Response(
            {"message": "OTP sent successfully. Please verify to activate your account."},
            status=status.HTTP_201_CREATED,
        )
      


    @action(detail=False, methods=['post'])
    def verify_otp(self, request):
        """Step 2: Verify OTP and return JWT tokens"""
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        if not user.verify_otp(otp):
            return Response({"error": "Invalid or expired OTP"}, status=400)

        return Response({
            "message": "OTP verified successfully",
        }, status=200)
    

    @action(detail=False, methods=["post"])
    def set_password(self, request):
        serializer = SetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Password set successfully. You can now log in."},
            status=status.HTTP_200_OK,
        )
    

class UserProfileViewset(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [TokenAuthentication, ]

   
    def get_queryset(self):
       return CustomUser.objects.filter(id = self.request.user.id)
   




class ProductViewset(ModelViewSet):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']

