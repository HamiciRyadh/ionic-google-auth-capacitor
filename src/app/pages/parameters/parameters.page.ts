import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Project} from "../../models/project";
import {ProjectService} from "../../services/project.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.page.html',
  styleUrls: ['./parameters.page.scss'],
})
export class ParametersPage implements OnInit {
  project: Project;

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    const projectId = routeParams.get('projectId');
    this.projectService.selectProject(projectId);
    this.projectService.getSelectedProjectObservable().subscribe(selectedProject => this.project = selectedProject);
  }

  quitterProjet(): void{
    if(this.isAdmin()){
      console.log('Todo: Supprimer project!')
    }else{
      console.log('Todo: Quitter project!')
    }
  }

  goToEditProject(): void{
    console.log('Todo: Edit project!')
  }

  isAdmin(): boolean {
    return this.project.admin === this.userService.getUser().uid;
  }
}
