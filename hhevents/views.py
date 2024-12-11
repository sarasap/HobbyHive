# hhevents/views.py

from rest_framework import generics, permissions
from .models import Event
from .serializers import EventSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser


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

class CreateEventView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)  # Allow file uploads

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)
