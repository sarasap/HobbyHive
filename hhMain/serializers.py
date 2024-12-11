from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile
from hhHobbies.models import Hobby

class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'confirm_password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data.pop('confirm_password')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

    def validate(self, data):
        if data['password'] != data.get('confirm_password'):
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_picture = serializers.ImageField(required=False)
    hobbies = serializers.PrimaryKeyRelatedField(
        queryset=Hobby.objects.all(), many=True, required=False
    )

    class Meta:
        model = UserProfile
        fields = ['username', 'bio', 'profile_picture', 'location', 'hobbies']

    def update(self, instance, validated_data):
        # Extract hobbies from validated data
        hobbies = validated_data.pop('hobbies', None)
        # Update other fields
        instance = super().update(instance, validated_data)
        # Update hobbies if provided
        if hobbies is not None:
            instance.hobbies.set(hobbies)
        return instance

