export interface UpdateAppDetailsRequest {
  id: number;
  name: string;
  description: string | null;
  baseUrl: string | null;
}
