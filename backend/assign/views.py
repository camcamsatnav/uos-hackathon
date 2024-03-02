import json

from django.shortcuts import HttpResponse
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt

from .models import Project, Student, Academics, Convener, Grade, IndividualMark


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
    jsonObj['preferences'] = students[0].preferences

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
    jsonObj = json.loads(request.body.decode('utf-8'))
    isModerationReq = False

    data = {
        'studentID': int(jsonObj.get('studentId')),
        'projectID': int(jsonObj.get('projectId')),
        'academicID': int(jsonObj.get('academicId')),
        'score': int(jsonObj.get('score'))
    }

    criteria1 = Q(student__exact=data['studentID'])
    criteria2 = Q(project__exact=data['projectID'])
    grades = Grade.objects.filter(criteria1 & criteria2)

    if len(grades) == 0:
        return HttpResponse('{"error": "No grade for that student and project"}')

    grade = grades[0]
    if grade.state == 'MODERATIONPENDING':
        grade.marks.all().delete()
        IndividualMark.objects.filter(student__exact=data['studentID']).filter(
            project__exact=data['projectID']).filter(academics__exact=data['academicID']).delete()

        grade.state = 'MODERATED'
        isModerationReq = True
    grade.save()

    if grade.state in ['SUBMITTED', 'MODERATED'] and not isModerationReq:
        return HttpResponse('{"error": "Marks cannot be posted for a project in this state"}')

    project = Project.objects.filter(id__exact=data['projectID'])[0]
    student = Student.objects.filter(id__exact=data['studentID'])[0]
    academic = Academics.objects.filter(id__exact=data['academicID'])[0]
    individual = IndividualMark(student=student, project=project, academics=academic,
                                mark=data['score'])
    individual.save()

    grade.marks.add(individual)
    grade.save()

    length = len(grade.marks.all())
    if length >= 2 and not isModerationReq:
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
        return HttpResponse('{"error": "No convener ID provided"}')

    if convenerID != '':
        jsonObj = {}
        convener = Convener.objects.filter(clerk_id__exact=convenerID)
        if len(convener) == 0:
            return HttpResponse({"error": "No convener with that ID"})

        students = Student.objects.all()
        academicList = Academics.objects.all()

        studentData = []
        academicData = []
        for academic in academicList:
            tempStudentData = []
            academicStudents = academic.students.all()
            for stu in academicStudents:
                tempStudentData.append(stu.id)
            academicData.append({
                'id': academic.id,
                'name': academic.name,
                'students': tempStudentData,
            })

        for stu in students:
            studentData.append(getStudentData(stu.clerk_id, False))

        jsonObj['id'] = convener[0].id
        jsonObj['name'] = convener[0].name
        jsonObj['students'] = studentData
        jsonObj['academics'] = academicData
        jsonObj['clerk_id'] = convener[0].clerk_id

        data = json.dumps(jsonObj, default=dumper, indent=2)
        return HttpResponse(data)


@csrf_exempt
def postConvener(request):
    jsonObj = json.loads(request.body.decode('utf-8'))
    data = {
        'studentID': int(jsonObj.get('studentId')),
        'academicID': map(int, jsonObj.get('academicId'))
    }

    academic = Academics.objects.filter(id__in=data['academicID'])
    student = Student.objects.filter(id__exact=data['studentID'])[0]

    if len(academic) == 0:
        return HttpResponse('{"error": "No academics with that ID"}')

    for a in academic:
        a.students.add(student)
        a.save()

    return HttpResponse('{"success": "Student added to academics"}')