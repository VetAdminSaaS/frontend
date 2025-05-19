export interface UserRegistration {
    email: string;
    password: string;
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
