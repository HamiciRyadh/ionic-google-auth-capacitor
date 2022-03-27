import { Injectable } from '@angular/core';
import {Project} from '../models/project';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where
} from '@angular/fire/firestore';
import {User} from '@firebase/auth';
import {Observable, Subscriber} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  projects: Project[];
  selectedProject: Observable<Project>;
  private selectedProjectSubscriber: Subscriber<Project>;

  constructor(private db: Firestore) {
    this.selectedProject = new Observable(subscriber => this.selectedProjectSubscriber = subscriber);
  }

  createProject(project: Project): Promise<boolean> {
    const {id, ...toCreate} = project;
    const newDocRef = doc(collection(this.db, 'projects'));
    return setDoc(newDocRef, {
      id: newDocRef.id,
      ...toCreate,
    }).then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  getRelatedProjects(user: User): Observable<Project[]> {
    const result = new Observable<Project[]>(subscriber => {
      const q = query(collection(this.db, 'projects'), where('canRead', 'array-contains', user.uid));
      onSnapshot(q, querySnapshot => {
        const a = [];
        querySnapshot.forEach(res => a.push(res.data()));
        subscriber.next(a);
      });
    });
    result.subscribe(value => this.projects = value);
    return result;
  }

  selectProject(project: Project): void {
    const docRef = doc(this.db, 'projects', project.id);
    onSnapshot(docRef, snapshot => {
      this.selectedProjectSubscriber.next(snapshot.data() as Project);
    });
  }

  deleteProject(project: Project): Promise<boolean> {
    return deleteDoc(doc(this.db, 'projects', project.id))
      .then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
}
