import { apiClient } from '../../../api/axios.instance';

export interface ContactInput {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  sitioWeb?: string;
}

export const contactService = {
  async send(payload: ContactInput) {
    const { data } = await apiClient.post<{ enviado: true }>(
      '/contacto',
      payload,
    );
    return data;
  },
};
