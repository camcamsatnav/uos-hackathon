# Generated by Django 5.0.2 on 2024-02-29 14:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assign', '0002_remove_project_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='grade',
            name='marks',
        ),
        migrations.CreateModel(
            name='IndividualMark',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('mark', models.IntegerField()),
                ('academics', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='assign.academics')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='assign.project')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='assign.student')),
            ],
        ),
        migrations.AddField(
            model_name='grade',
            name='marks',
            field=models.ManyToManyField(to='assign.individualmark'),
        ),
    ]