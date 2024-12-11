# hhevents/serializers.py

from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.ReadOnlyField(source='organizer.username')
    attendees_count = serializers.IntegerField(source='attendees.count', read_only=True)
    is_attending = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'
    def get_is_attending(self, obj):
        user = self.context.get('request').user
        return user in obj.attendees.all()
