export interface ICourseBasic {
    ID: number
    GUID: string
    Name: string
    Price: number
    Speciality: string
    AdditionalSpecialities: string
    EGS: string
    ProfEducationType: string
    Volume: number
    BeginDate: string
    EndDate: string
    EducationForm: string
    Department: string
    DepartmentGUID: string
    ListenersGroup: string
    IsCME: number
    MoodleID: string
    Listeners: number
    AllowedByCathListeners: number
    FullyApprovedListeners: number
    NotApprovedByCathListeners: string
    NotApprovedListeners: string
    FullTimeBeginDate: string
    FullTimeEndDate: string
    RequestDate: string
    SertificationExamDate: string | null
    IsEducationDistance: number
    Territory: string
}

export interface IDocument {
    id: number
    level?: number
    type?: number
    name: string
    organization: string
    hours: string
    comment: string
    documentCheck: number
    documentName?: string
    fileURL: string | null
    fullName: string | null
    firstDate: string
    firstDateName: string
    secondDate: string | null
    secondDateName: string | null
    serial: string
    speciality: string
    isDocumentNew?: boolean
}