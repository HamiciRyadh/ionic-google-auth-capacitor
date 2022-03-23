import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router,
              private userService: UserService) { }


  ngOnInit() {
  }

  logOut(): void{
    this.userService.logOut()
      .then(()=>{
        this.router.navigate(['/login']).then(() =>{});
      })
  }
}
