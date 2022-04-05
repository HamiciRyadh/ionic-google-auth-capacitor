
export class Attachment {
  id: string;
  name: string;
  fileURL: string;
  type: string;

  constructor(name: string, fileURL: string, type: string) {
    this.id = '';
    this.name = name;
    this.fileURL = fileURL;
    this.type = type;
  }
}
