from django.urls import path
from . import views

urlpatterns = [
    path('student/', views.student, name='student'),
    path('academics/', views.academics, name='academics'),
    path('convener/', views.convener, name='convener'),
    path('marks/', views.postMarks, name='postmarks'),
    path('assign/', views.postConvener, name='postconvener'),
]