export interface Species { id:number; nombre:string; }
export interface AnimalPhoto { id:string; url:string; esPrincipal:boolean; }
export interface AnimalRecord {
  id:string; nombre:string; especieId:number; especie:Species|null; razaNombre:string|null;
  sexo:'MACHO'|'HEMBRA'|'DESCONOCIDO'|null; color:string|null; pesoKg:number|null;
  edadAproximadaMeses:number|null; fotos:AnimalPhoto[];
}
export interface PublicationSummary { id:string; descripcion:string; requisitos:string|null; estado:'PUBLICADA'|'RETIRADA'|'ADOPTADA'; fechaAdopcion:string|null; }
export interface ShelteredAnimal {
  id:string; estado:'EN_RESGUARDO'|'ADOPTADO'; establecimientoId:string;
  mascota:AnimalRecord; publicacion:PublicationSummary|null;
}
export interface AnimalInput {
  nombre:string; especieId:number; razaNombre?:string|null; sexo?:string|null;
  color?:string|null; pesoKg?:number|null; edadAproximadaMeses?:number|null;
}
