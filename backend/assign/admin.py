from django.contrib import admin
from .models import Module, Project, Student, Academics, Convener, Grade, IndividualMark

# Register your models here.

admin.site.register(Module)
admin.site.register(Project)
admin.site.register(Student)
admin.site.register(Academics)
admin.site.register(Convener)
admin.site.register(Grade)
admin.site.register(IndividualMark)
