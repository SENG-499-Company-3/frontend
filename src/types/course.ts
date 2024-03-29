export type Course = {
    id?: string;
    Term: number;
    Subj: string;
    Num: number;
    Section: string;
    Title: string;
    SchedType?: string;
    Instructor: string;
    ProfessorID: string;
    Bldg: string;
    Room: string;
    Begin: number;
    End: number;
    Days: string;
    StartDate: string;
    EndDate: string;
    Cap?: number;
}