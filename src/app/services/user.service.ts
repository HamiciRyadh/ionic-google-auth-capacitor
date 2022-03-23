import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  createAccount(fullName:string, email: string, telephone:string, password: string): void{
    console.log('TODO: Register with Email Password');

    console.log('fullName :',fullName);
    console.log('email :',email);
    console.log('telephone :',telephone);
    console.log('password :',password);
  }

  logIn(email: string, password: string): void{
    console.log('TODO: Login with Email Password');

    console.log('email :',email);
    console.log('password :',password);
  }

  recoverPassword(email: string): void{
    console.log('TODO: Recover Password');

    console.log('email :',email);
  }
}
