from django.db import models


# Create your models here.

class Module(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=10)


class Exam(models.Model):
    ExamState = models.TextChoices("ExamState", "PENDING SUBMITTED MODERATIONPENDING MODERATED")
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    date = models.DateField()
    state = models.CharField(choices=ExamState.choices, default=ExamState.PENDING, max_length=20)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    total_marks = models.IntegerField()


class Student(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    exams = models.ManyToManyField(Exam)
    clerk_id = models.CharField(max_length=256)


class Academics(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    students = models.ManyToManyField(Student)
    clerk_id = models.CharField(max_length=256)


class Convener(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    clerk_id = models.CharField(max_length=256)
