import { Injectable } from '@angular/core';
import {Project} from '../models/project';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  Firestore, getDocs,
  onSnapshot,
  query,
  setDoc, updateDoc,
  where, writeBatch
} from '@angular/fire/firestore';
import {User} from '@firebase/auth';
import { Auth } from '@angular/fire/auth';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly mSelectedProject: BehaviorSubject<Project>;

  constructor(private db: Firestore,
              private auth: Auth) {
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

  updateProject(project: Project): Promise<boolean> {
    const newDocRef = doc(this.db, 'projects', project.id);
    return updateDoc(newDocRef, {
      name: project.name,
      description: project.description
    })
      .then(() => true)
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

  async removeMember(user: User): Promise<boolean> {
    const batch = writeBatch(this.db);
    const projectId: string =  this.mSelectedProject.getValue().id;

    // Removing the user from the members of the project.
    batch.update(doc(this.db, 'projects', projectId), {
      canRead: arrayRemove(user.uid),
      canWrite: arrayRemove(user.uid),
    });

    // Removing the user from the tickets where he is defined as the owner.
    const queryOwner = query(collection(this.db, 'projects', projectId, 'tickets'),
      where('owner', '==', user.uid));
    const queryOwnerSnapshot = await getDocs(queryOwner);
    queryOwnerSnapshot.forEach((document) => {
      batch.update(document.ref, {
        owner: 'undefined',
      });
    });

    // Removing the user from the tickets where he is defined as the creator.
    const queryCreator = query(collection(this.db, 'projects', projectId, 'tickets'),
      where('createdBy', '==', user.uid));
    const queryCreatorSnapshot = await getDocs(queryCreator);
    queryCreatorSnapshot.forEach((document) => {
      batch.update(document.ref, {
        createdBy: 'undefined',
      });
    });

    return batch.commit()
      .then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
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

  async deleteProject(project: Project): Promise<boolean> {
    const batch = writeBatch(this.db);
    const projectId: string =  project.id;
    batch.delete(doc(this.db, 'projects', projectId));

    const q = query(collection(this.db, 'projects', projectId, 'tickets'));
    const queryCreatorSnapshot = await getDocs(q);
    queryCreatorSnapshot.forEach((document) => {
      batch.delete(document.ref);
    });

    return batch.commit()
      .then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  leaveProject(user: User): Promise<boolean> {
    return this.removeMember(user);
  }

  userCanWrite(): boolean {
    return this.getSelectedProject()?.canWrite.includes(this.auth.currentUser?.uid);
  }
}
