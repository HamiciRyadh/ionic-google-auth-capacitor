import { Injectable } from '@angular/core';
import {Ticket} from '../models/ticket';
import {collection, doc, Firestore, setDoc} from '@angular/fire/firestore';
import {Project} from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private db: Firestore) { }

  addTicketToProject(ticket: Ticket, project: Project): Promise<boolean> {
    const {id, ...toCreate} = ticket;
    console.log(ticket);
    const newDocRef = doc(collection(this.db, 'projects', project.id, 'tickets'));
    return setDoc(newDocRef, {
      id: newDocRef.id,
      toCreate,
    }).then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
}
