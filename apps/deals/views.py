from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Deal
from .serializers import DealSerializer


class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all()
    serializer_class = DealSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if not serializer.validated_data.get("assigned_to"):
            serializer.save(assigned_to=self.request.user)
        else:
            serializer.save()
