import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {

  private projectId = '';
  constructor(private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    this.projectId = routeParams.get('projectId');
  }

  goBackToProject(): void {
    this.router.navigate([`/projects/${this.projectId}`], {replaceUrl: true}).then();
  }
}
