import {Project} from './project';

export class Ticket {
  id: string;
  label: string;         //(projectName-NumTicket)
  name: string;
  description: string;
  type: string;       // (bug/task)
  status: string;     // (open, started, blocked, finished)
  priority: string;   // (high, medium, low)
  owner: string;
  createdBy: string;
  creationDateTime: Date;

  constructor(name: string, description: string, type: string, priority: string, ownerUid: string, status: string,
              creatorUid: string, project: Project) {
    this.id = '';
    this.label = project.name + '-' + project.id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.status = status;
    this.priority = priority;
    this.owner = ownerUid;
    this.createdBy = creatorUid;
    this.creationDateTime = new Date();
  }
}
