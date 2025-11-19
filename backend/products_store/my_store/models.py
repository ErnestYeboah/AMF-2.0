from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
import random
from django.contrib.auth import get_user_model
# Create your models here.

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

# Custom User Model
class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    profile_image = models.ImageField(blank=True, null=True )
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_expiry = models.DateTimeField(blank=True, null=True)
    otp_verified_for_password_change = models.BooleanField(default=False)
    otp_verified_at = models.DateTimeField(null=True, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    last_login_email_sent = models.DateField(null=True, blank=True)


    objects = CustomUserManager()

    def generate_otp(self):
        """Generate and store a 6-digit OTP with expiry (5 minutes)."""
        self.otp = f"{random.randint(100000, 999999)}"
        self.otp_expiry = timezone.now() + timezone.timedelta(minutes=5)
        self.save()
        return self.otp

    def verify_otp(self, otp_input):
        """Check if the OTP matches and is still valid."""
        if not self.otp or self.otp != otp_input:
            return False
        if timezone.now() > self.otp_expiry:
            return False
        # Optional: clear OTP after successful verification
        self.otp = None
        self.otp_expiry = None
        self.is_active = True 
        self.save()
        return True
    

class Products(models.Model):

    CATEGORY_CHOICES = [
        ('clothing', 'clothing'),
        ('shoes', 'shoes'),
        ('accessories', 'accessories'),
        ('jewelry', 'jewelry'),
        ('watches', 'watches'),
        ('headwear', 'headwear'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True , default=200.00)
    added_on = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES , default='clothing')
    is_available = models.BooleanField(default=True)
    brief_note = models.CharField(max_length=255, blank=True, null=True , default="Just In")

    def __str__(self):
        return self.name


User = get_user_model()
class Cart(models.Model) : 
    added_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='cart_items')
    name = models.CharField(max_length=255)
    product_id = models.IntegerField()
    category = models.CharField(max_length=255)
    size = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # ✅ unit price
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # ✅ computed fieldt=0.00)  

    def __str__(self):
         return f"{self.name} x{self.quantity} (${self.total_price})"

    
    
    def save(self, *args, **kwargs):
        # Auto-calculate total_price when saving
        self.total_price = self.price * self.quantity
        super().save(*args, **kwargs)


class Favorite(models.Model):
    added_on = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey(User, on_delete=models.CASCADE , null=True )
    name =  models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    product_id = models.OneToOneField(Products, on_delete=models.CASCADE , null=True, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # ✅ unit price


class CheckoutAddress(models.Model):
    added_by = models.ForeignKey(User, on_delete=models.CASCADE , null=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=10)
    address = models.CharField(max_length=255 , default="No address")
    additional_phone_number = models.CharField(max_length=10 , default="no addtional phone number")
    region = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    additional_information = models.TextField(default="No Additional Information from user")


    def __str__(self):
        return f"First Name : {self.first_name}  , Region : {self.region} , City :  {self.city}"
    
    
class History(models.Model):
     added_on = models.DateTimeField(auto_now_add=True)
     product_name = models.CharField(max_length=255)
     product_id = models.OneToOneField(Products , on_delete=models.CASCADE)


     def __str__(self):
         return self.product_name
     
    