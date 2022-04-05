import { Injectable } from '@angular/core';
import {Ticket} from '../models/ticket';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  query,
  setDoc
} from '@angular/fire/firestore';
import {Project} from '../models/project';
import {Observable} from 'rxjs';
import {UploadImageService} from './upload-image.service';
import {Attachment} from '../models/attachment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private db: Firestore,
              private uploadImageService: UploadImageService) { }

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

  updateTicketToProject(ticket: Ticket, projectId: string): Promise<boolean> {
    const newDocRef = doc(collection(this.db, 'projects', projectId, 'tickets'),ticket.id);
    return setDoc(newDocRef, {
      ...ticket
    }).then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  async addAttachment(ticket: Ticket, projectId: string): Promise<boolean> {
    const fileName = `${new Date().getTime()}.jpg`;
    const imagePath: string = await this.uploadImageService.selectAndUploadImage(`attachments/${projectId}`,
      fileName);
    if (!imagePath) {
      return false;
    }
    const newDocRef = doc(collection(this.db, 'projects', projectId, 'tickets', ticket.id, 'attachments'));
    return setDoc(newDocRef, {
      id: newDocRef.id,
      name: fileName,
      fileURL: imagePath,
      type: 'image/jpg',
    }).then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  deleteAttachment(projectId: string, ticketId: string, attachment: Attachment): Promise<boolean> {
    return deleteDoc(doc(this.db, 'projects', projectId, 'tickets', ticketId, 'attachments', attachment.id))
      .then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  getRelatedAttachments(projectId: string, ticketId: string): Observable<Attachment[]> {
    return new Observable<Attachment[]>(subscriber => {
      const q = query(collection(this.db, 'projects', projectId, 'tickets', ticketId, 'attachments'));
      onSnapshot(q, querySnapshot => {
        const a: Attachment[] = [];
        querySnapshot.forEach(res => a.push(res.data() as Attachment));
        subscriber.next(a);
      });
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

  getTicket(projectId: string, ticketId: string): Observable<Ticket> {
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
