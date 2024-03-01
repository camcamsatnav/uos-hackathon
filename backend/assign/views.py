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


def getStudentData(studentID, isStudent=True):
    jsonObj = {}
    students = Student.objects.filter(clerk_id__exact=studentID)
    if len(students) == 0:
        return {"error": "No student with that ID"}
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
                tempObj = {'mark': mark.mark}
                if not isStudent:
                    tempObj['academic'] = mark.academics.clerk_id
                tempIndividualMarks.append(tempObj)

        for grade in grades:
            if grade.project.id == project.id:
                temp['state'] = grade.state
                temp['grade'] = tempIndividualMarks

                if grade.state not in ['SUBMITTED', 'MODERATED'] and isStudent:
                    temp['grade'] = []

        temp['id'] = project.id
        temp['name'] = project.name
        temp['module'] = project.module.code

        jsonObj['projects'].append(temp)
    jsonObj['clerk_id'] = students[0].clerk_id

    return jsonObj


def student(request):
    try:
        studentID = request.GET['id']
    except:
        return HttpResponse('{"error": "No student ID provided"}')

    if studentID != '':
        jsonObj = getStudentData(studentID, True)
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
        return HttpResponse('{"error": "No academics ID provided"}')

    if academicsID != '':
        jsonObj = {}
        academic = Academics.objects.filter(clerk_id__exact=academicsID)
        if len(academic) == 0:
            return HttpResponse({"error": "No academics with that ID"})
        students = academic[0].students.all()
        studentData = []
        for stu in students:
            studentData.append(getStudentData(stu.clerk_id, False))
        jsonObj['id'] = academic[0].id
        jsonObj['name'] = academic[0].name
        jsonObj['students'] = studentData
        jsonObj['clerk_id'] = academic[0].clerk_id

        data = json.dumps(jsonObj, default=dumper, indent=2)
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
