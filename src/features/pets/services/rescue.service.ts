import { apiClient } from '../../../api/axios.instance';
import type { AnimalInput, ShelteredAnimal, Species } from '../types/pet.types';
export async function uploadPhotos(path:string,files:File[],data?:AnimalInput):Promise<ShelteredAnimal> {
  const form = new FormData();
  if(data) Object.entries(data).forEach(([key,value]) => {if(value != null && value !== '') form.append(key,String(value));});
  files.forEach(file => form.append('fotos',file));
  return (await apiClient.post<ShelteredAnimal>(path,form,{headers:{'Content-Type':undefined},timeout:120000})).data;
}
export const rescueService = {
  list:async (limit:number,offset:number,signal:AbortSignal) => (await apiClient.get<ShelteredAnimal[]>('/animales-resguardados',{params:{limit,offset},signal})).data,
  get:async (id:string,signal?:AbortSignal) => (await apiClient.get<ShelteredAnimal>(`/animales-resguardados/${id}`,{signal})).data,
  species:async (signal:AbortSignal) => (await apiClient.get<Species[]>('/especies',{signal})).data,
  create:(data:AnimalInput,files:File[]) => uploadPhotos('/animales-resguardados',files,data),
  update:async (id:string,data:AnimalInput) => (await apiClient.patch<ShelteredAnimal>(`/animales-resguardados/${id}`,data)).data,
  addPhotos:(id:string,files:File[]) => uploadPhotos(`/animales-resguardados/${id}/fotos`,files),
  removePhoto:async (id:string,photo:string) => (await apiClient.delete<{eliminada:boolean;limpiezaPendiente:boolean}>(`/animales-resguardados/${id}/fotos/${photo}`)).data,
};
