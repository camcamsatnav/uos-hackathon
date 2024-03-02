type Types = {
    clerk_id?: string;
    id: number;
    name?: string;
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
    students: Types[];
}

type CurrentData = {
    currentStudent: Types;
    currentProject: number;
    currentAcademic: number;
    tabValue: number;
    visibleTabs: boolean;
}
export type { Types, Project, IndividualMark, AcademicType, CurrentData};