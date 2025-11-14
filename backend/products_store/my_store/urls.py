from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('users', UserViewset, basename='users')
router.register("products", ProductViewset , basename="products")
router.register("me", UserProfileViewset, basename="me")
router.register("cart", CartViewset , basename="cart")
router.register("favorite", FavoriteModelViewset, basename="favorite")
router.register("address", CheckoutAddressViewset, basename="address")
router.register("history", HistoryViewset, basename="history")
router.register("auth", FirebaseAuthViewSet, basename="firebase-auth")


urlpatterns = [
    path('', include(router.urls)),
]