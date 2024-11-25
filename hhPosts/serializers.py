from rest_framework import serializers
from .models import Post, Comment, Event
from django.utils import timezone
from django.conf import settings
import os
from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions
from datetime import datetime, timedelta

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    media_url = serializers.SerializerMethodField()  # New field for full media URL

    class Meta:
        model = Post
        fields = ['id', 'user', 'caption', 'media_url', 'created_at', 'likes_count', 'comments', 'media']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_media_url(self, obj):
        if obj.media:
            # Check if in production environment (Azure)
            if not settings.DEBUG:
                try:
                    # Azure Blob Storage SAS Token Generation
                    account_name = 'hobbyhivemedia'
                    account_key = os.environ['AZURE_STORAGE_ACCOUNT_KEY']
                    container_name = 'media'
                    
                    # Generate SAS token
                    sas_token = generate_blob_sas(
                        account_name=account_name,
                        account_key=account_key,
                        container_name=container_name,
                        blob_name=obj.media.name,
                        permission=BlobSasPermissions(read=True),
                        expiry=datetime.utcnow() + timedelta(hours=1)  # Token valid for 1 hour
                    )
                    
                    # Construct full URL with SAS token
                    blob_url = f"https://{account_name}.blob.core.windows.net/{container_name}/{obj.media.name}"
                    return f"{blob_url}?{sas_token}"
                
                except Exception as e:
                    print(f"Error generating SAS token: {e}")
                    return None
            else:
                # Development: Local media URL
                request = self.context.get('request')
                if request and obj.media:
                    return request.build_absolute_uri(obj.media.url)
        return None
    
    def validate_media(self, value):
        # Allowed image types
        ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp']
        if value.content_type not in ALLOWED_IMAGE_TYPES:
            raise serializers.ValidationError("Unsupported file type. Please upload an image in JPG, PNG, GIF, BMP, or WEBP format.")
        
        return value

class EventSerializer(serializers.ModelSerializer):
    creator = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'location', 'creator', 'created_at']
        read_only_fields = ['id', 'creator', 'created_at']
        
    def validate_date(self, value):
        """
        Validate that the event date is not in the past
        """
        if value < timezone.now():
            raise serializers.ValidationError("Event date cannot be in the past")
        return value