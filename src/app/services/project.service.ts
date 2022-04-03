import { Injectable } from '@angular/core';
import {Project} from '../models/project';
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  query,
  setDoc, updateDoc,
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

  async addMember(user: User, hasWriteRight: boolean = false): Promise<boolean> {
    let data;
    if (hasWriteRight) {
      data = {
        canRead: arrayUnion(user.uid),
        canWrite: arrayUnion(user.uid),
      };
    } else {
      data = {
        canRead: arrayUnion(user.uid),
      };
    }
    return updateDoc(doc(this.db, 'projects', this.mSelectedProject.getValue().id), data)
      .then(() => true)
      .catch(err => {
        console.log(err);
        return false;
      });
  }

  async updateMemberRights(user: User, hasWriteRight: boolean = false): Promise<boolean> {
    let data;
    if (hasWriteRight) {
      data = {
        canRead: arrayUnion(user.uid),
        canWrite: arrayUnion(user.uid),
      };
    } else {
      data = {
        canRead: arrayUnion(user.uid),
        canWrite: arrayRemove(user.uid),
      };
    }
    return updateDoc(doc(this.db, 'projects', this.mSelectedProject.getValue().id), data)
      .then(() => true)
      .catch(err => {
        console.log(err);
        return false;
      });
  }

  removeMember(user: User): Promise<boolean> {
    // TODO: Remove from canRead and canWrite and check for tickets where that member was owner/creator and .. deal with it.
    // TODO: Use a firestore transaction.
    return undefined;
  }

  canMemberWrite(uid: string): boolean {
    return this.mSelectedProject.getValue()?.canWrite.find(mUid => mUid === uid) != null;
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
