from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('spleets/', views.SpleetView.as_view()),
    path('download/vocals/<int:id>/', views.Vocals.as_view()),
    path('download/instrumental/<int:id>/', views.Instrumental.as_view()),
]
