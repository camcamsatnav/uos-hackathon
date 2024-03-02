from django.db import models


class Module(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=10)


class Project(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)


class Student(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    projects = models.ManyToManyField(Project)
    preferences = models.CharField(max_length=100)
    clerk_id = models.CharField(max_length=256)


class Academics(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    students = models.ManyToManyField(Student, blank=True)
    clerk_id = models.CharField(max_length=256)


class IndividualMark(models.Model):
    id = models.AutoField(primary_key=True)
    mark = models.IntegerField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    academics = models.ForeignKey(Academics, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("project", "student", "academics"),)


class Grade(models.Model):
    ExamState = models.TextChoices("ExamState", "PENDING SUBMITTED MODERATIONPENDING MODERATED")
    id = models.AutoField(primary_key=True)
    marks = models.ManyToManyField(IndividualMark, blank=True)
    state = models.CharField(choices=ExamState.choices, default=ExamState.PENDING, max_length=20)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)


class Convener(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    clerk_id = models.CharField(max_length=256)
