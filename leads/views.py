from rest_framework import viewsets
from .models import Lead
from .serializers import LeadSerializer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer

    def perform_create(self, serializer):
        lead = serializer.save()
        self.broadcast_lead(lead)

    def perform_update(self, serializer):
        lead = serializer.save()
        self.broadcast_lead(lead)

    def broadcast_lead(self, lead):
        from .serializers import LeadSerializer  # احتياطي لو فيه circular import
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "leads",
            {
                "type": "send_lead_update",
                "lead": LeadSerializer(lead).data
            }
        )
