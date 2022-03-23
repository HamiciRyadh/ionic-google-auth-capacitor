import { Injectable } from '@angular/core';
import firebase from "firebase/compat/app";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  async createAccount(fullName:string, email: string, telephone:string, password: string): Promise<void>{
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    if(userCredential){
      const user = userCredential.user;
      await firebase.auth().currentUser.sendEmailVerification();
      await firebase.auth().currentUser.updateProfile({displayName: fullName});
      // Todo: Add user to fireStore
      await firebase.auth().signOut();
    }
  }

  async logIn(email: string, password: string): Promise<void>{
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    if(userCredential){
      const user = userCredential.user;
      // Todo: Get user from fireStore
    }
  }

  async recoverPassword(email: string): Promise<void>{
    await firebase.auth().sendPasswordResetEmail(email);
  }
}
