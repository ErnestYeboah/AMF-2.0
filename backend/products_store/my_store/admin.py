from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin

# Register your models here.

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    ordering = ('email',)
    search_fields = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )


@admin.register(Products)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'category']
    search_fields = ['name', 'category']
    

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['name', "quantity", 'total_price', 'category', 'size']

@admin.register(Favorite)
class CartAdmin(admin.ModelAdmin):
    list_display = ['name', "category", 'product_id' , 'added_on']