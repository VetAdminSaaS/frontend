export interface UserRegistrationResponse {
    id:number;
    email: string;
    legalOrganizationId: number;
    tributeId: number;
    identification: string;
    identificationDocumentId?: number; 
    dv?: number; 
    names?: string;
    company?: string;
    tradeName?: string;
    address?: string;
    phone?: string;
    municipalityId?: number;
}
