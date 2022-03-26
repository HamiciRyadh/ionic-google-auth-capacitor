import { Injectable } from '@angular/core';
import {collection, doc, Firestore, getDoc, setDoc, updateDoc} from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification, sendPasswordResetEmail,
  signInWithEmailAndPassword, signOut,
  updateProfile
} from '@angular/fire/auth';
import {User} from '@firebase/auth';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User;
  private mUser: Observable<User>;
  // Necessary to store the user's email and password to to fill the fields of the login page after the registration
  // process without needing to request the user to retype them.
  private email: string;
  private password: string;

  constructor(private db: Firestore, private auth: Auth) {
    this.mUser = new Observable<User>(subscriber => {
      this.auth.onAuthStateChanged(newUser => {
        this.user = newUser;
        subscriber.next(newUser);
        console.log('New user: ', newUser);
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
      await this.logOut();
    }
  }

  async logIn(email: string, password: string): Promise<boolean> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    if(userCredential){
      if (userCredential.user.emailVerified) {
        this.user = userCredential.user;
        // Todo: Observe user from fireStore
        // const docRef = doc(this.db, 'users', email);
        // onSnapshot(docRef, snapshot => {
        //   this.mUser = snapshot.data();
        // });
        return true;
      } else {
        // TODO: If the email is not verified display error message without redirecting the user to another page.
        alert('Email not verified');
        return false;
      }
    }
  }

  async logOut(): Promise<void>{
    await signOut(this.auth);
  }

  async findByEmail(email: string): Promise<User> {
    const snapshot = await getDoc(doc(this.db, 'users', email));
    return snapshot.data() as User;
  }

  async recoverPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  public updateUser(user: User): void{
    updateDoc(doc(collection(this.db, 'users'), user.email), {
      ...user,
    });
  }

  getLoginCredentials(): string[] {
    return [this.email ?? '', this.password ?? ''];
  }

  getUser(): User {
    return this.user;
  }

  getObservableUser(): Observable<User> {
    return this.mUser;
  }
}
