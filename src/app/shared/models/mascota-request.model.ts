export interface MascotaRequest {
    nombreCompleto: string;
    raza: string;
    profilepath:string;
    especie: Especie;
    fechaNacimiento: string;
    peso: number;
    esterilizado: boolean;
    apoderadoIds: number[];

}

export enum Especie {
    PERRO = "PERRO",
    GATO = "GATO",
    CONEJO = "CONEJO",
    AVE = "AVE",
}