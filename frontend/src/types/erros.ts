export interface ApiErrorResponse {
  status: number;
  data: {
    message: string;
    field?: string;
  };
}

export interface ApiError extends Error {
  response: ApiErrorResponse;
  isAxiosError: boolean;
}
