import json

from django.shortcuts import HttpResponse
from django.core import serializers
from django.db.models import Q

from .models import Module, Project, Student, Academics, Convener, Grade, IndividualMark


def dumper(obj):
    try:
        return obj.toJSON()
    except:
        return obj.__dict__


def student(request):
    jsonObj = {}
    try:
        studentID = request.GET['id']
    except:
        return HttpResponse('{"error": "No student ID provided"}')

    if studentID != '':
        students = Student.objects.filter(clerk_id__exact=studentID)
        projects = students[0].projects.all()
        projectID = []
        for project in projects:
            projectID.append(project.id)

        criteria1 = Q(student__exact=students[0].id)
        criteria2 = Q(project__in=projectID)

        grades = Grade.objects.filter(criteria1 & criteria2)
        individualMarks = IndividualMark.objects.filter(criteria1 & criteria2)
        jsonObj['id'] = students[0].id
        jsonObj['name'] = students[0].name

        jsonObj['projects'] = []
        for project in projects:
            temp = {}
            tempIndividualMarks = []

            for mark in individualMarks:
                if mark.project.id == project.id:
                    indMark = {'mark': mark.mark}
                    tempIndividualMarks.append(indMark)

            for grade in grades:
                if grade.project.id == project.id:
                    temp['grade'] = tempIndividualMarks
                    temp['state'] = grade.state
            temp['id'] = project.id
            temp['name'] = project.name
            temp['module'] = project.module.code

            jsonObj['projects'].append(temp)
        jsonObj['clerk_id'] = students[0].clerk_id

        data = json.dumps(jsonObj, default=dumper, indent=2)

        return HttpResponse(data)


def exam(request):
    try:
        examID = request.GET['id']
    except:
        examID = ''

    if examID == '':
        data = serializers.serialize('json', Project.objects.all())
    else:
        idList = examID.split(',')
        data = serializers.serialize('json', Project.objects.filter(id__in=idList))
    return HttpResponse(data)


def academics(request):
    try:
        academicsID = request.GET['id']
    except:
        academicsID = ''

    if academicsID == '':
        data = serializers.serialize('json', Academics.objects.all())
    else:
        data = serializers.serialize('json', Academics.objects.filter(clerk_id__exact=academicsID))
    return HttpResponse(data)


def convener(request):
    try:
        convenerID = request.GET['id']
    except:
        convenerID = ''

    if convenerID == '':
        data = serializers.serialize('json', Convener.objects.all())
    else:
        data = serializers.serialize('json', Convener.objects.filter(clerk_id__exact=convenerID))
    return HttpResponse(data)


def module(request):
    try:
        moduleID = request.GET['id']
    except:
        moduleID = ''

    if moduleID == '':
        data = serializers.serialize('json', Module.objects.all())
    else:
        idList = moduleID.split(',')
        data = serializers.serialize('json', Module.objects.filter(id__in=idList))
    return HttpResponse(data)
