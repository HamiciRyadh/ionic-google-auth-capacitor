import { Component, OnInit } from '@angular/core';
import {ProjectService} from '../../services/project.service';
import {Project} from '../../models/project';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {

  project: Project;
  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.selectedProject.subscribe(selectedProject => {
      this.project = selectedProject;
    });
  }

}
