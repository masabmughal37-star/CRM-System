from django.db import models
from django.conf import settings


class Customer(models.Model):

    STATUS_CHOICES = [
        ("lead", "Lead"),
        ("contacted", "Contacted"),
        ("prospect", "Prospect"),
        ("customer", "Customer"),
        ("lost", "Lost"),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="lead",
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
