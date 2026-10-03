from rest_framework.routers import DefaultRouter

from .views import TagViewSet, LeadSourceViewSet


router = DefaultRouter()
router.register("tags", TagViewSet, basename="tag")
router.register("lead-sources", LeadSourceViewSet, basename="lead-source")

urlpatterns = router.urls