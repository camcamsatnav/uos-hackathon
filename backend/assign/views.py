import json

from django.shortcuts import HttpResponse
from django.core import serializers
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt

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


@csrf_exempt
def postMarks(request):
    # Add state based validation
    # disallow editing of marks if state is SUBMITTED or MODERATED
    jsonObj = json.loads(request.body.decode('utf-8'))
    data = {
        'studentID': int(jsonObj.get('studentId')),
        'projectID': int(jsonObj.get('projectId')),
        'academicID': int(jsonObj.get('academicId')),
        'score': int(jsonObj.get('score'))
    }
    project = Project.objects.filter(id__exact=data['projectID'])[0]
    student = Student.objects.filter(id__exact=data['studentID'])[0]
    academic = Academics.objects.filter(id__exact=data['academicID'])[0]
    individual = IndividualMark(student=student, project=project, academics=academic,
                                mark=data['score'])
    individual.save()

    criteria1 = Q(student__exact=data['studentID'])
    criteria2 = Q(project__exact=data['projectID'])
    grades = Grade.objects.filter(criteria1 & criteria2)

    if len(grades) == 0:
        return HttpResponse('{"error": "No grade for that student and project"}')
    else:
        grade = grades[0]
        if grade.state in ['SUBMITTED', 'MODERATED']:
            return HttpResponse('{"error": "Marks cannot be posted for a project in this state"}')

        grade.marks.add(individual)
        grade.save()

        length = len(grade.marks.all())
        if length >= 2:
            grade.state = 'SUBMITTED'

            total = 0
            for mark in grade.marks.all():
                total += mark.mark
            average = total / length
            if 40 >= average >= 37:
                grade.state = 'MODERATIONPENDING'

            marks = list(grade.marks.all())
            marks.sort(key=lambda x: x.mark, reverse=True)
            if marks[0].mark - marks[-1].mark >= 10:
                grade.state = 'MODERATIONPENDING'

        grade.save()
        return HttpResponse('{"success": "Marks posted"}')


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
