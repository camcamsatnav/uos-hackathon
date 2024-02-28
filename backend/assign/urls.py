from django.urls import path
from . import views

urlpatterns = [
    path('student/', views.student, name='student'),
    path('exam/', views.exam, name='exam'),
    path('academics/', views.academics, name='academics'),
    path('convener/', views.convener, name='convener'),
    path('module/', views.module, name='module'),
]