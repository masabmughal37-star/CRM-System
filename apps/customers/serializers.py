from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = "__all__"
        read_only_fields = ["created_by", "created_at"]

    def to_internal_value(self, data):
        data = data.copy()

        first_name = data.pop("first_name", "")
        last_name = data.pop("last_name", "")

        if first_name or last_name:
            data["name"] = f"{first_name} {last_name}".strip()

        if "phone_number" in data and "phone" not in data:
            data["phone"] = data.pop("phone_number")

        return super().to_internal_value(data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        name_parts = (instance.name or "").split(" ", 1)

        representation["first_name"] = name_parts[0] if name_parts else ""
        representation["last_name"] = name_parts[1] if len(name_parts) > 1 else ""
        representation["phone_number"] = instance.phone or ""

        return representation
