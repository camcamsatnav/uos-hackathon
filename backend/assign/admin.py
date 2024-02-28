from django.contrib import admin
from .models import Module, Exam, Student, Academics, Convener
# Register your models here.

admin.site.register(Module)
admin.site.register(Exam)
admin.site.register(Student)
admin.site.register(Academics)
admin.site.register(Convener)

