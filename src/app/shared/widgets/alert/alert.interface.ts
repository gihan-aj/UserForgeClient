import { AlertType } from "./alert-type.enum";

export interface Alert {
    type: AlertType;
    title: string;
    message: string;
    details: string[];
}
