export type SeverityType = 'error' | 'info' | 'success' | 'warning'
export type MarginType = 'dense' | 'none' | 'normal'
export type VariantType = 'filled' | 'standard' | 'outlined'

export interface ICourseBasic {
    ID: number
    Contractor?: number
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

export interface ICourseUser {
    id: number
    requestID: number
    rowID: number
    fullname: string
    cathedraAllow?: number
    instituteAllow?: number
    comment: string
    lastUpdate: string | null
    requestCME: string | null
    checks: {
        cathedra: ICourseUserCheck,
        institute: ICourseUserCheck
    }
}

export interface ICourse extends ICourseBasic {
    StartDateTooltip: string
    BeginDateMonth: string
    users: Array<ICourseUser>
}

export interface ICourseUserCheck {
    comment: string
    date: string | null
    label: string
    person: string | undefined
}

export interface ICourseFilters {
    searchString: string
    searchUser: number | null
    enrolPossible: boolean
    CME: boolean
    traditional: boolean
    budgetaryOnly: boolean
    nonBudgetaryOnly: boolean
    retraining: boolean
    skillsDevelopment: boolean
    forDoctors: boolean
    forNursingStaff: boolean
    currentVolume: number
    startDate: string
    endDate: string
    minStartDate: string
    maxEndDate: string
}

export interface IAddress {
    postcode: string
    country: string
    region: string
    locality: string
    localityType: number
    street: string
    house: string
    room?: string
}

export interface ISelectedCourse {
    ID: number
    Name: string
}

export type ICourseFC = (course: ISelectedCourse) => void
export type IRequestFC = (request: ISelectedRequest) => void

export interface ICourseRoots {
    group: number | null
    cathedra?: string | null
}

export interface IEducationType {
    id: number
    level: number
    name: string
    firstDateName: string
    secondDateName: string
    documentName: string
}

export interface IPassport {
    number: string
    series: string
    unitCode: string
    birthPlace: string
    issuedBy: string
    issuedDate: string
}

export interface IWork extends IAddress {
    listenerPosition: string
    accessionDate: string
    hrPhone: string
    workPhone: string
    fileURL: string | null
    newFile?: any
    positionTypes: string[]
}

export interface IDocument {
    id: number
    level?: number
    type?: number
    name: string
    organization: string
    hours?: string | null
    comment: string
    documentCheck?: number
    documentName?: string
    fileURL: string | null
    fullName?: string | null
    firstDate: string | null
    firstDateName: string
    secondDate: string | null
    secondDateName: string | null
    serial: string
    speciality: string
    isDocumentNew?: boolean
    newFile?: INewFile | null
}

export interface IProfile {
    lastname: string
    firstname: string
    middlename: string
    email: string
    snils: string
    birthdate: string
}

export interface IUserOption {
    id: number
    login: string
    name: string
    isUserAdded: boolean
}

export interface ISelectedRequest {
    ID: number,
    Price: number,
    rowID: number,
    DocumentsApproved: number,
    courseName: string
}

export interface IRequest extends ICourseBasic {
    DocumentsApproved: number
    RequestCreateDate: string
    RequestCME: string | null
    requestID: number
    rowID: number
}


export interface ITabPanel {
    value: number
    index: number
}

export interface INewFile {
    filename: string
    base64: string
}