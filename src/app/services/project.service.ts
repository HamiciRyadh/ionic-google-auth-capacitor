import { Injectable } from '@angular/core';
import {Project} from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor() { }

  createProject(project: Project): void{

  }

  getRelatedProjects(): Project[]{
    return [];
  }

  selectProject(): Project{
    return null;
  }
}
