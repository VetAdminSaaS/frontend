export interface UsuarioStoreDTO {
  
    identification: string;
    names: string;
    address: string;
    email: string;
    phone: string;
    legalOrganizationId: number;
    tributeId: number;
    municipalityId: number;
    identificationDocumentId:number;
    company?: string;
    tradeName: string;
    dv:number;
}