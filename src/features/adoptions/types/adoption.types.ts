import type { AnimalRecord, PublicationSummary } from '../../pets/types/pet.types';
export interface AdoptionPublication extends PublicationSummary {
  animalResguardadoId:string; createdAt:string;
  mascota:AnimalRecord;
  registroAdopcion?: AdoptionRecord | null;
  establecimiento:{id:string;nombre:string;tipo:'VETERINARIA'|'REFUGIO';direccion:string;telefono:string;horarioAtencion:string|null};
}
export interface AdoptionText { descripcion:string; requisitos:string|null; }
export type AdoptionAction='publicar'|'retirar'|'adoptar';
export interface AdoptionInput {
  nombreAdoptante: string;
  telefonoAdoptante: string;
  fechaAdopcion: string;
  observaciones: string | null;
}
export interface AdoptionRecord extends AdoptionInput { id: string; createdAt: string; }
