from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    assigned_to_email = serializers.ReadOnlyField(source="assigned_to.email")
    customer_name = serializers.ReadOnlyField(source="customer.first_name")
    deal_title = serializers.ReadOnlyField(source="deal.title")

    class Meta:
        model = Task
        fields = (
            "id",
            "title",
            "task_type",
            "priority",
            "status",
            "assigned_to",
            "assigned_to_email",
            "customer",
            "customer_name",
            "deal",
            "deal_title",
            "due_date",
            "description",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")
