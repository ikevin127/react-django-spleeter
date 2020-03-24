from django.urls import path
from . import views

urlpatterns = [
    path('spleets/', views.SpleetView.as_view(), name='spleets_list'),
    path('download/vocals/<int:id>/', views.Vocals.as_view()),
    path('download/instrumental/<int:id>/', views.Instrumental.as_view()),
]
