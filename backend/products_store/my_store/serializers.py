from .models import *
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework.authtoken.models import Token


class UserSerializer(ModelSerializer):
    class Meta : 
        model = CustomUser
        fields = ['id', 'email', 'password', 'profile_image']
        read_only_fileds = ['id', 'otp']
        extra_kwargs = {'password' : {
            'write_only' : True,
            'required' : True
        }}


    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        Token.objects.get_or_create(user=user)
        return user

        
    
class SetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        user = CustomUser.objects.filter(email=data["email"]).first()
        if not user:
            raise serializers.ValidationError("User not found.")
        if not user.is_active:
            raise serializers.ValidationError("User not verified yet.")
        return data

    def save(self):
        user = CustomUser.objects.get(email=self.validated_data["email"])
        user.set_password(self.validated_data["password"])
        user.save()
        return user

        
class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)


class ProductSerializer(ModelSerializer):
    class Meta :
        model = Products
        fields = "__all__"
    