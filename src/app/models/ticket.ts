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
  attachments: string[];

  constructor(name: string, description: string, type: string, priority: string, ownerUid: string, creatorUid,
              project: Project) {
    this.id = '';
    this.label = project.name + '-' + project.tickets.length;
    this.name = name;
    this.description = description;
    this.type = type;
    this.status = 'open';
    this.priority = priority;
    this.owner = ownerUid;
    this.createdBy = creatorUid;
    this.creationDateTime = new Date(); //TODO: Use timestamp UTC to unify.
    this.attachments = [];
  }
}
