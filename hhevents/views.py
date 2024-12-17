# hhevents/views.py

from rest_framework import generics, permissions
from .models import Event
from .serializers import EventSerializer
from datetime import datetime
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ValidationError

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rsvp_event(request, pk):
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({'detail': 'Event not found.'}, status=404)
    
    if request.user in event.attendees.all():
        event.attendees.remove(request.user)
        return Response({'detail': 'RSVP canceled.'})
    else:
        if event.max_attendees and event.attendees.count() >= event.max_attendees:
            return Response({'detail': 'Event is full.'}, status=400)
        event.attendees.add(request.user)
        return Response({'detail': 'RSVP successful.'})
    
class ListEventsView(generics.ListAPIView):
    queryset = Event.objects.all().order_by('date')
    serializer_class = EventSerializer  
    permission_classes = [permissions.AllowAny]  # Change to IsAuthenticated if needed

    def get_queryset(self):
        """
        Filter out past events and return only future events or ongoing events.
        """
        now = datetime.now()
        # Filter events to exclude past events
        return Event.objects.filter(date__gte=now).order_by('date')
    
    
class CreateEventView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)  # Allow file uploads

    def perform_create(self, serializer):
        event_date = serializer.validated_data['date']
        event_time = serializer.validated_data['time']
        
        event_datetime = datetime.combine(event_date, event_time)
        
        if event_datetime < datetime.now():
            raise ValidationError({'detail': 'Event date and time cannot be in the past.'})

        serializer.save(organizer=self.request.user)
