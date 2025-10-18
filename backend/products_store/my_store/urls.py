from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('users', UserViewset, basename='users')
router.register("products", ProductViewset , basename="products")
router.register("me", UserProfileViewset, basename="me")

urlpatterns = [
    path('', include(router.urls)),
]