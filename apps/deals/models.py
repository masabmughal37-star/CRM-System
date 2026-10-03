from django.db import models
from django.conf import settings
from apps.core.models import TimeStampedModel
from apps.customers.models import Customer


class Deal(TimeStampedModel):
    STAGE_CHOICES = (
        ("qualification", "Qualification"),
        ("proposal", "Proposal Sent"),
        ("negotiation", "In Negotiation"),
        ("closed_won", "Closed Won"),
        ("closed_lost", "Closed Lost"),
    )

    title = models.CharField(max_length=200)
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="deals"
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_deals"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    stage = models.CharField(max_length=30, choices=STAGE_CHOICES, default="qualification")
    expected_close_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} - {self.customer.first_name} ({self.get_stage_display()})"
