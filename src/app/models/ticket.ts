export class Ticket {
  id: string;         //(projectName-NumTicket)
  nom: string;
  description: string;
  type: string;       // (Bug,Tache)
  status: string;     // (Ouvert, En cours, bloqué, terminé)
  priorite: string;   // (High, Medium, Low)
  duree: string;
  responsable: string;
  createdBy: string;
  creationDateTime: Date;
  listePiecesJointes: string[];
}
