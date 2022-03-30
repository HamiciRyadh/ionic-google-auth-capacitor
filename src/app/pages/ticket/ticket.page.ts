import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TicketService} from "../../services/ticket.service";

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {

  private projectId = '';
  public ticket;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private ticketService: TicketService) { }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    this.projectId = routeParams.get('projectId');
    const ticketId = routeParams.get('ticketId');
    this.ticketService.getTicket(this.projectId, ticketId).subscribe((t)=>{
      this.ticket = t;
    })
  }

  goBackToProject(): void {
    this.router.navigate([`/projects/${this.projectId}`], {replaceUrl: true}).then();
  }

  goToEditTicket(): void {
    console.log('Todo: Edit Todo!')
  }
}
