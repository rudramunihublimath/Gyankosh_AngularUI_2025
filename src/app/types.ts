
export interface ResponseDto<T> {
    message: T;
    status: boolean
}
export interface UserLoginReq {
    email: string;
    password: string;
}

export interface UserReq {
    id?: number;
    code?: string;
    firstname: string;
    lastname: string;
    gender: any;
    email: string;
    password: string;
    contactNum1: string;
    contactNum2: string;
    country: string;
    state: string;
    city: string;
    createdAt?: string;
    updatedAt?: string;
    dbRole?: string;
    linkdinID: string;
    facebookID: string;
    instaID: string;
    pannum: string;
    address1: string;
    address2: string;
    pincode: string;
    dob: string;
    profileActive: string;
    profileNOTActiveUpdatedby?: string;
    imageName?: string;

    reportingmanagerId: number;
    reportingmanagerName?: string,
    nameofMyTeam?: string,
    citiesAllocated?: Array<string>
    schoolAllocated?: Array<number>;
    mbpcode?: string;
    jwtToken?: string;
}

export interface UserTableDto {
    firstname: string;
    lastname: string;
    email: string;
    id: number;
}

export interface ChangePassword {
    email: string;
    oldPWD: string;
    newPWD: string;
}

export interface SchoolDetail {
    name: string,
    email: string;
    country: string;
    state: string;
    city: string;
    board: Array<string>;  
    contactNum1: string;
    contactNum2: string;
    chainofID: Array<number>;
    address1: string;
    address2: string;
    pincode: string;
    websiteURL: string;
    linkdinID: string;
    facebookID: string;
    instaID: string;
    targetPhase: string;
    mbpPersonName: string;
    mbpPersonContactNum: string;
    mbpPersonEmail: string;
    refPersonName: string;
    refPersonContactNum: string;
    id: number;
    code?: string;
}

export interface SchoolTableDetail {
    id: number;
    name: string;
    email: string;
    city: string;
    contactNum1: string;
    pincode: string;

}

export interface SchoolPOC {
    teacherfirstname: string;
    teacherlastname: string;
    designation: string;
    contactNum1: string;
    contactNum2: string;
    linkdinID: string;
    email:string;
    schoolNameRequest: any;
    id?: number;
    firstContact?: string;
    teachingToGrade?:  string | Array<string>;
}

export interface SchoolMOM {
    id: number;
    meetingDateTime: string;
    nextAppointment: string;
    mom: string;
    feedback_Whatwentwell: string;
    feedback_Improvement: string;  
    schoolNmReq?: any;
    schoolNameRequest?: any;
}
export interface OutReach {
    id?: string;
    outreachuserid: string;
    outreach_assigneddate: string;
    outreachheaduserid: string;
    outreachHead_assigneddate: string;
}
export interface Trainer {
    id?: string;
    trainTheTrainersId?: string;
    trainTheTrainerHeadId?: string;
    trainingPartCompleted?: string
    dateofCompletion?: string
    dataValidated?: string
}

export interface MBPFlag {
    id?: string;
    schoolActive: string;
    schoolInterested: string;
    dealClosed: string;
    isDiscontinued: string;
    discontinuedDate: string;
    reasonForDiscontinue: string;
    reasonValidated: string;
}

export interface Agreement {
    id?: string;
    agreementCompleted: string;
    agreementCompletedDate: string | null;
    agreementScanCopyLink: string | null;
    uploadedByUserId?: string | null;
    agreementReq?: {id: string};
}

export interface SchoolGrade {
    id?: string;
    year?: number;
    gradeName?: string;
    totalStudentCount?: string;
    booksGivenCount?: string;
    schoolNmReq2?: any;
}

export interface Report2Dto {
    id: number;
    name: string;
    nextAppointment: string;
}