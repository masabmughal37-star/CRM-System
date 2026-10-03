from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "task_type", "priority", "status", "assigned_to", "customer", "deal", "due_date")
    list_filter = ("task_type", "priority", "status", "assigned_to", "created_at")
    search_fields = ("title", "description", "customer__first_name", "deal__title")
    ordering = ("-created_at",)
