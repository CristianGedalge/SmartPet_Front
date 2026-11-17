import { apiClient } from '../../../api/axios.instance';
import type { AdoptionAction, AdoptionInput, AdoptionPublication, AdoptionText } from '../types/adoption.types';
export const adoptionsService={
  list:async (limit:number,offset:number,signal:AbortSignal)=>(await apiClient.get<AdoptionPublication[]>('/adopciones',{params:{limit,offset},signal})).data,
  mine:async (limit:number,offset:number,signal:AbortSignal)=>(await apiClient.get<AdoptionPublication[]>('/adopciones/mis-publicaciones',{params:{limit,offset},signal})).data,
  get:async (id:string,signal:AbortSignal)=>(await apiClient.get<AdoptionPublication>(`/adopciones/${id}`,{signal})).data,
  create:async (animalResguardadoId:string,data:AdoptionText)=>{await apiClient.post('/adopciones',{animalResguardadoId,...data});},
  update:async (id:string,data:AdoptionText)=>{await apiClient.patch(`/adopciones/${id}`,data);},
  action:async (id:string,action:Exclude<AdoptionAction,'adoptar'>)=>{await apiClient.patch(`/adopciones/${id}/${action}`,{});},
  adopt:async (id:string,data:AdoptionInput)=>{await apiClient.patch(`/adopciones/${id}/adoptar`,data);},
};
