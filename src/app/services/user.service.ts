import { Injectable } from '@angular/core';
import {collection, doc, Firestore, getDoc, onSnapshot, query, setDoc, updateDoc, where} from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification, sendPasswordResetEmail,
  signInWithEmailAndPassword, signOut,
  updateProfile
} from '@angular/fire/auth';
import {User} from '@firebase/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import {ProjectService} from './project.service';
import {UploadImageService} from './upload-image.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly mUser: BehaviorSubject<User>;
  private readonly mUsers: BehaviorSubject<User[]>;
  // Necessary to store the user's email and password to to fill the fields of the login page after the registration
  // process without needing to request the user to retype them.
  private email: string;
  private password: string;

  constructor(private db: Firestore,
              private auth: Auth,
              private projectService: ProjectService,
              private uploadImageService: UploadImageService) {
    this.mUser = new BehaviorSubject(undefined);
    this.mUsers = new BehaviorSubject<User[]>([]);

    this.auth.onAuthStateChanged(newUser => {
      if (newUser != null) {
        const docRef = doc(this.db, 'users', newUser.email);
        onSnapshot(docRef, snapshot => this.mUser.next(snapshot.data() as User));
      } else {this.mUser.next(newUser);}
    });

    this.projectService.getSelectedProjectObservable().subscribe(selectedProject => {
      const projectUsers = [...new Set([...selectedProject.canRead,...selectedProject.canWrite])];
      const q = query(collection(this.db, 'users'), where('uid', 'in', projectUsers));
      onSnapshot(q, querySnapshot => {
        const a: User[] = [];
        querySnapshot.forEach(res => a.push(res.data() as User));
        this.mUsers.next(a);
      });
    });
  }

  async createAccount(fullName: string, email: string, telephone: string, password: string): Promise<void>{
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

    this.email = email;
    this.password = password;

    if(userCredential){
      await sendEmailVerification(userCredential.user);
      await updateProfile(userCredential.user, {displayName: fullName});

      // Add user to fireStore
      await setDoc(doc(collection(this.db, 'users'), email), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: fullName,
        phoneNumber: telephone,
        photoUrl: '',
      });
      // Disconnect the user so that he has to log in after verifying his email address
      await this.logout();
    }
  }

  async logIn(email: string, password: string): Promise<boolean> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    if(userCredential){
      if (userCredential.user.emailVerified) {
        return true;
      } else {
        // TODO: If the email is not verified display error message without redirecting the user to another page.
        alert('Email not verified');
        return false;
      }
    }
  }

  async logout(): Promise<void>{
    await signOut(this.auth);
  }

  async recoverPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async findByEmail(email: string): Promise<User> {
    const snapshot = await getDoc(doc(this.db, 'users', email));
    return snapshot.data() as User;
  }

  public async changeProfilePicture(): Promise<boolean> {
    const user: User = this.auth.currentUser;
    if (!user) {return false;}

    const imagePath: string = await this.uploadImageService.selectAndUploadImage('profile-picture', this.getUser().uid);
    if (!imagePath) {return false;}

    return Promise.all([updateProfile(user, {photoURL: imagePath}),
      updateDoc(doc(collection(this.db, 'users'), user.email), {photoURL: imagePath})])
      .then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
  public updateUser(user: User, name: string = '', phone: string = ''): Promise<boolean> {
    return updateDoc(doc(collection(this.db, 'users'), user.email), {
      displayName: name,
      phoneNumber: phone
    }).then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  isMember(email: string): boolean {
    return this.mUsers.getValue().find(user => user.email === email) != null;
  }

  getLoginCredentials(): string[] {
    return [this.email ?? '', this.password ?? ''];
  }

  getUser(): User {
    return this.mUser.getValue();
  }

  getObservableUser(): Observable<User> {
    return this.mUser;
  }

  getObservableUsers(): Observable<User[]> {
    return this.mUsers;
  }

  findUserFromUid(uid: string): User | undefined {
    return this.mUsers.getValue().find(user => user.uid === uid);
  }
}
