from rest_framework import serializers
from .models import Post, Comment
from django.utils import timezone
from hhHobbies.serializers import HobbySerializer
from hhHobbies.models import Hobby

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    media_url = serializers.SerializerMethodField()
    hobbies = HobbySerializer(many=True, read_only=True)  # Read-only representation
    hobby_ids = serializers.PrimaryKeyRelatedField(queryset=Hobby.objects.all(), many=True, write_only=True, source='hobbies')  # Write-only for creating/updating

    class Meta:
        model = Post
        fields = [
            'id', 'user', 'caption', 'media_url', 'created_at',
            'likes_count', 'comments', 'media', 'hobbies', 'hobby_ids'
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_media_url(self, obj):
        request = self.context.get('request')
        if obj.media and request:
            return request.build_absolute_uri(obj.media.url)
        return None
    
    def validate_media(self, value):
        # Allowed image types
        ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp']
        if value.content_type not in ALLOWED_IMAGE_TYPES:
            raise serializers.ValidationError("Unsupported file type. Please upload an image in JPG, PNG, GIF, BMP, or WEBP format.")
        
        return value
