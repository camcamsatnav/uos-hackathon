type StudentType = {
    clerk_id?: string;
    id: number;
    name?: string;
    preferences?: string;
    projects: Project[];
}

type Project = {
    id: number;
    name: string;
    state: string;
    module: string;
    grade: IndividualMark[];
}

type IndividualMark = {
    mark: number;
    academic?: string;
}

type AcademicType = {
    id: number;
    name: string;
    clerk_id: string;
    students: StudentType[];
}

type CurrentData = {
    currentStudent: StudentType;
    currentProject: number;
    currentAcademic: number;
    tabValue: number;
    visibleTabs: boolean;
}

type SimpleAcademicType = {
    id: number;
    name: string;
    clerk_id: string;
    students: number[];
}
export type { StudentType, Project, IndividualMark, AcademicType, CurrentData, SimpleAcademicType};