import { Injectable } from '@angular/core';
import {Project} from '../models/project';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  query,
  setDoc,
  where
} from '@angular/fire/firestore';
import {User} from '@firebase/auth';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly mSelectedProject: BehaviorSubject<Project>;

  constructor(private db: Firestore) {
    this.mSelectedProject = new BehaviorSubject(new Project('', '', ''));
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
    return new Observable<Project[]>(subscriber => {
      const q = query(collection(this.db, 'projects'), where('canRead', 'array-contains', user.uid));
      onSnapshot(q, querySnapshot => {
        const a = [];
        querySnapshot.forEach(res => a.push(res.data()));
        subscriber.next(a);
      });
    });
  }

  selectProject(projectId: string): void {
    const docRef = doc(this.db, 'projects', projectId);
    onSnapshot(docRef, snapshot => {
      this.mSelectedProject.next(snapshot.data() as Project);
    }, console.log);
  }

  getSelectedProjectObservable(): Observable<Project> {
    return this.mSelectedProject;
  }

  getSelectedProject(): Project {
    return this.mSelectedProject.getValue();
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
