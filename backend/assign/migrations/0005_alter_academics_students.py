# Generated by Django 5.0.2 on 2024-03-02 01:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assign', '0004_alter_grade_marks_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='academics',
            name='students',
            field=models.ManyToManyField(blank=True, to='assign.student'),
        ),
    ]