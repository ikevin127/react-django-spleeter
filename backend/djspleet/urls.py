from django.urls import path, include

urlpatterns = [
    path('api/', include('spleet.urls')),
]
