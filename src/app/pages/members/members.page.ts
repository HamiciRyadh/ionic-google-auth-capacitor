import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '@firebase/auth';
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectService} from "../../services/project.service";
import {Project} from "../../models/project";

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
})
export class MembersPage implements OnInit {

  users: User[];
  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private projectService: ProjectService) { }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    const projectId = routeParams.get('projectId');
    const project: Project = this.projectService.getSelectedProject();
    if (project === undefined || project.id !== projectId) {
      this.projectService.selectProject(projectId);
    }
    this.userService.getObservableUsers().subscribe(users => this.users = users);
  }

  call(user: User): void {}

  addMember(): void {
  //  TODO: Ajouter un membre en canRead + canWrite
  }

  addVisitor(): void {
  //  TODO: Ajouter un membre en canRead seulement
  }

  removeFromProject(user: User): void {
  //  TODO: Remove from canRead and canWrite and check for tickets where that member was owner/creator and .. deal with it.
  }
}
