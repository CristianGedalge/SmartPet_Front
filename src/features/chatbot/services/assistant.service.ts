import axios from "axios";
import { apiClient } from "../../../api/axios.instance";

export type AssistantRole = "USUARIO" | "ASISTENTE";

export interface AssistantMessage {
  rol: AssistantRole;
  contenido: string;
}

export const assistantService = {
  async ask(mensajes: AssistantMessage[]) {
    const recent = mensajes.slice(-12);
    if (recent[0]?.rol === "ASISTENTE") recent.shift();
    const { data } = await apiClient.post<{ respuesta: string }>(
      "/asistente",
      { mensajes: recent },
      { timeout: 35000 },
    );
    return data;
  },
};

export const assistantErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return "No se pudo consultar al asistente.";
  }
  if (error.code === "ECONNABORTED") {
    return "El asistente tardó demasiado. Inténtalo nuevamente.";
  }
  const message = (error.response?.data as { message?: string | string[] } | undefined)
    ?.message;
  if (Array.isArray(message)) return message[0] ?? "Revisa el mensaje e inténtalo nuevamente.";
  return message || "No se pudo consultar al asistente. Inténtalo nuevamente.";
};
