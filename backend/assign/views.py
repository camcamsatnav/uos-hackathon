from django.shortcuts import HttpResponse
from django.core import serializers

from .models import Module, Exam, Student, Academics, Convener


def student(request):
    try:
        studentID = request.GET['id']
    except:
        studentID = ''

    if studentID == '':
        data = serializers.serialize('json', Student.objects.all())
    else:
        data = serializers.serialize('json', Student.objects.filter(clerk_id__exact=studentID))
    return HttpResponse(data)


def exam(request):
    try:
        examID = request.GET['id']
    except:
        examID = ''

    if examID == '':
        data = serializers.serialize('json', Exam.objects.all())
    else:
        idList = examID.split(',')
        data = serializers.serialize('json', Exam.objects.filter(id__in=idList))
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
