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
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  projects: Project[];

  constructor(private db: Firestore) { }

  createProject(project: Project): Promise<void> {
    return setDoc(doc(collection(this.db, 'projects')), {
      ...project,
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

  selectProject(): Project {
    return null;
  }

  deleteProject(project: Project): void {
    const q = query(collection(this.db, 'projects'),  where('name', '==', project.name));
    getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(result => deleteDoc(result.ref));
    });
  }
}
