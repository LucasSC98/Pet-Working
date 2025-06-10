import { ApiError } from "../types/erros";

export const erroMensagem = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;

    if (apiError.response) {
      switch (apiError.response.status) {
        case 400:
          return apiError.response.data?.message || "Dados inválidos";
        case 401:
          return "Email ou senha incorretos";
        case 403:
          return "Acesso não autorizado";
        case 404:
          return apiError.response.data?.message || "Recurso não encontrado";
        case 409:
          if (apiError.response.data?.field === "email") {
            return "Este email já está cadastrado";
          }
          if (apiError.response.data?.field === "cpf") {
            return "Este CPF já está cadastrado";
          }
          return apiError.response.data?.message || "Conflito de dados";
        case 500:
          return "Erro interno do servidor";
        default:
          return (
            apiError.response.data?.message ||
            "Ocorreu um erro. Tente novamente."
          );
      }
    }
  }

  return "Ocorreu um erro inesperado";
};
