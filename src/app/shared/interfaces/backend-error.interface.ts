export interface BackendError {
  code: string;
  description: string;
  details: BackendError[];
}
