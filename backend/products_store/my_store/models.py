from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
import random
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
    profile_image = models.ImageField(blank=True, null=True , default='default_profile.png')
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_expiry = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

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
