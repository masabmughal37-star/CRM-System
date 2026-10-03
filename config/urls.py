from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("api/auth/", include("apps.user_accounts.urls")),
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/customers/", include("apps.customers.urls")),
    path("api/deals/", include("apps.deals.urls")),
    path("api/tasks/", include("apps.tasks.urls")),
    path("api/companies/", include("apps.crm_companies.urls")),
    path("api/contacts/", include("apps.crm_contacts.urls")),

    # Tags & Lead Sources
    path("api/metadata/", include("apps.crm_metadata.urls")),
]