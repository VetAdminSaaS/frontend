export interface UserProfile {
    id:number;
    email:string;
    role: role,
    identificationDocumentId: number;
    identification:string;
    address: string;
    municipalityId: number;
    tributeId: number;
    phone:string;
    legalOrganizationId:number;
    names:string;
    company:string;
    tradeName:string;
    dv:number;
    
    
}
export enum role {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN'
}