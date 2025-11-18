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
from datetime import timedelta
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from firebase_admin import auth as firebase_auth


User = get_user_model()


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


    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated] ,authentication_classes = [TokenAuthentication])
    def request_password_change_otp(self, request):
        """Step 1: Send OTP to logged-in user's email"""
        user = request.user
        otp = user.generate_otp()

        send_mail(
            subject="Password Change OTP",
            message=f"Your OTP for password change is {otp}. It expires in 5 minutes.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )

        return Response({"message": "OTP sent to your email."}, status=200)


    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated], authentication_classes = [TokenAuthentication])
    def verify_password_change_otp(self, request):
        """Step 2: Verify OTP"""
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        otp = serializer.validated_data["otp"]
        user = request.user

        if not user.verify_otp(otp):
            return Response({"error": "Invalid or expired OTP."}, status=400)

        user.otp_verified_for_password_change = True
        user.otp_verified_at = timezone.now()
        user.save()

        return Response({"message": "OTP verified. You can now change your password."}, status=200)


    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated], authentication_classes=[TokenAuthentication])
    def change_password(self, request):
        """Step 3: Change password if OTP verified recently"""
        user = request.user

        # Check if OTP was verified and still valid (within 10 mins)
        if not user.otp_verified_for_password_change:
            return Response({"error": "OTP not verified."}, status=400)

        if user.otp_verified_at < timezone.now() - timedelta(minutes=10):
            user.otp_verified_for_password_change = False
            user.save()
            return Response({"error": "OTP verification expired."}, status=400)

        # Validate new password
        serializer = SetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = serializer.validated_data["password"]

        user.set_password(password)
        user.otp_verified_for_password_change = False  # reset flag
        user.save()

        return Response({"message": "Password changed successfully!"}, status=200)

    

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

    @action(detail=False, methods=['delete'], url_path='clear_cart' ,permission_classes=[IsAuthenticated] ,authentication_classes = [TokenAuthentication])
    def clear_cart(self, request):
        """Custom action to clear all items in the user's cart"""
        user = request.user
        Cart.objects.filter(added_by=user).delete()
        return Response({"message": "Cart cleared successfully."}, status=status.HTTP_200_OK)



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

class HistoryViewset(ModelViewSet):
    queryset = History.objects.all()
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [TokenAuthentication , ]




class FirebaseAuthViewSet(ModelViewSet):
    """
    Handles Firebase login using ID token from frontend (Firebase Google Sign-In)
    """

    @action(detail=False, methods=["post"])
    def firebase_login(self, request):
        """Authenticate using Firebase token"""
        id_token = request.data.get("token")

        if not id_token:
            return Response({"error": "Token is required"}, status=400)

        try:
            # 🔹 Verify token with Firebase
            decoded_token = firebase_auth.verify_id_token(id_token)
            email = decoded_token.get("email")
            uid = decoded_token.get("uid")
            name = decoded_token.get("name", "")

            if not email:
                return Response({"error": "No email found in token"}, status=400)

            # 🔹 Get or create user in Django
            user, created = User.objects.get_or_create(
                email=email,
                defaults={"is_active": True},
            )

            # 🔹 Create / get DRF token
            token, _ = Token.objects.get_or_create(user=user)

            return Response(
                {
                    "message": "Login successful",
                    "token": token.key,
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "username": user.username,
                    },
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response({"error": str(e)}, status=400)