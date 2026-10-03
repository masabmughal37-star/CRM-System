from rest_framework import serializers

from .models import Tag, LeadSource


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = [
            "id",
            "name",
            "description",
            "contacts",
            "customers",
            "is_archived",
            "archived_at",
            "created_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "is_archived",
            "archived_at",
            "created_by",
            "created_at",
            "updated_at",
        ]


class LeadSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadSource
        fields = [
            "id",
            "name",
            "description",
            "contacts",
            "customers",
            "is_archived",
            "archived_at",
            "created_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "is_archived",
            "archived_at",
            "created_by",
            "created_at",
            "updated_at",
        ]
