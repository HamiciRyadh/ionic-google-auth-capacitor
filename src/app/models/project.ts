import {Ticket} from "./ticket";

export class Project {
  nom: string;
  description: string;
  tickets: Ticket[];
  admin: string;
  canRead: string[];
  canWrite: string[];
}
