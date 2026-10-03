from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Tag, LeadSource
from .serializers import TagSerializer, LeadSourceSerializer


class ArchiveRestoreMixin:
    def get_queryset(self):
        queryset = super().get_queryset()

        # Restore must be able to find archived records.
        if self.action == "restore":
            return queryset

        archived = self.request.query_params.get("archived", "false")

        if archived.lower() == "true":
            return queryset.filter(is_archived=True)

        return queryset.filter(is_archived=False)

    @action(detail=True, methods=["post"])
    def archive(self, request, pk=None):
        instance = self.get_object()

        if not instance.is_archived:
            instance.is_archived = True
            instance.archived_at = timezone.now()
            instance.save(update_fields=["is_archived", "archived_at"])

        return Response(self.get_serializer(instance).data)

    @action(detail=True, methods=["post"])
    def restore(self, request, pk=None):
        instance = self.get_object()

        if instance.is_archived:
            instance.is_archived = False
            instance.archived_at = None
            instance.save(update_fields=["is_archived", "archived_at"])

        return Response(self.get_serializer(instance).data)


class TagViewSet(ArchiveRestoreMixin, viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class LeadSourceViewSet(ArchiveRestoreMixin, viewsets.ModelViewSet):
    queryset = LeadSource.objects.all()
    serializer_class = LeadSourceSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
