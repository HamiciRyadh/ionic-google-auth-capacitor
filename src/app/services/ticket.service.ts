import { Injectable } from '@angular/core';
import {Ticket} from '../models/ticket';
import {collection, deleteDoc, doc, Firestore, onSnapshot, query, setDoc, where} from '@angular/fire/firestore';
import {Project} from '../models/project';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private db: Firestore) { }

  addTicketToProject(ticket: Ticket, project: Project): Promise<boolean> {
    const {id, ...toCreate} = ticket;
    const newDocRef = doc(collection(this.db, 'projects', project.id, 'tickets'));
    return setDoc(newDocRef, {
      id: newDocRef.id,
      ...toCreate,
    }).then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  getRelatedTicketsOfProject(projectId: string): Observable<Ticket[]> {
    return new Observable<Ticket[]>(subscriber => {
      const q = query(collection(this.db, 'projects', projectId, 'tickets'));
      onSnapshot(q, querySnapshot => {
        const a: Ticket[] = [];
        querySnapshot.forEach(res => a.push(res.data() as Ticket));
        subscriber.next(a);
      });
    });
  }

  getTicket(projectId:string, ticketId: string): Observable<Ticket> {
    return new Observable<Ticket>(subscriber => {
      const q = query(collection(this.db, 'projects', projectId, 'tickets'));
      onSnapshot(q, querySnapshot => {
        let a: Ticket;
        querySnapshot.forEach((res) => {
          if(res.id === ticketId){
            a = res.data() as Ticket;
          }
        });
        subscriber.next(a);
      });
    });
  }

  deleteTicketFromProject(ticket: Ticket, projectId: string): Promise<boolean> {
    return deleteDoc(doc(this.db, 'projects', projectId, 'tickets', ticket.id))
      .then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
}
