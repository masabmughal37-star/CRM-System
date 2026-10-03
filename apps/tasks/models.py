from django.db import models
from django.conf import settings
from apps.core.models import TimeStampedModel
from apps.customers.models import Customer
from apps.deals.models import Deal


class Task(TimeStampedModel):
    TASK_TYPE_CHOICES = (
        ("call", "Call Log"),
        ("meeting", "Meeting"),
        ("email", "Email"),
        ("todo", "To-Do Task"),
    )

    PRIORITY_CHOICES = (
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    )

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    )

    title = models.CharField(max_length=200)
    task_type = models.CharField(max_length=20, choices=TASK_TYPE_CHOICES, default="todo")
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tasks"
    )
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="tasks"
    )
    deal = models.ForeignKey(
        Deal,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="tasks"
    )
    
    due_date = models.DateTimeField(null=True, blank=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} ({self.get_task_type_display()}) - {self.get_status_display()}"
