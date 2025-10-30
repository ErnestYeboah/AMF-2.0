from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.mail import send_mail
from django.conf import settings
import requests
from rest_framework.viewsets import ModelViewSet
from .models import CustomUser
from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication 
from rest_framework import filters
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
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category']
    search_fields = ['name' , 'category']


class CartViewset(ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [TokenAuthentication, ]

    def get_queryset(self):
        return Cart.objects.filter(added_by = self.request.user)

    def perform_create(self, serializer):
        serializer.save(added_by = self.request.user)



class FavoriteModelViewset(ModelViewSet):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated , ]
    authentication_classes = [TokenAuthentication,]

    def get_queryset(self):
        return Favorite.objects.filter(added_by = self.request.user)
    

    def perform_create(self, serializer):
        serializer.save(added_by = self.request.user)





class CheckoutAddressViewset(ModelViewSet):
    queryset = CheckoutAddress.objects.all()
    serializer_class = CheckoutAddressSerializer
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [TokenAuthentication,]

    def get_queryset(self):
        return CheckoutAddress.objects.filter(added_by = self.request.user)
    

    def perform_create(self, serializer):
        serializer.save(added_by = self.request.user)

    @action(detail=False, methods=["get", "patch"], url_path="my-address")
    def my_address(self, request):
        user = request.user
        address = CheckoutAddress.objects.filter(added_by=user).first()

        if request.method == "GET":
            if address:
                serializer = self.get_serializer(address)
                return Response(serializer.data)
            return Response({"message": "No address found"}, status=status.HTTP_404_NOT_FOUND)

        if request.method == "PATCH":
            data = request.data
            if address:
                # Update existing address
                serializer = self.get_serializer(address, data=data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(
                    {"message": "Address updated", "address": serializer.data},
                    status=status.HTTP_200_OK,
                )
            else:
                # Create a new one
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                serializer.save(added_by=user)
                return Response(
                    {"message": "Address created", "address": serializer.data},
                    status=status.HTTP_201_CREATED,
                )
