import { Injectable } from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {getStorage, ref, getDownloadURL, uploadBytes, getBlob} from '@angular/fire/storage';
import {Directory, Filesystem} from '@capacitor/filesystem';


@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  constructor() { }

  public async selectAndUploadImage(path: string, fileName: string): Promise<string> {
    const image: Photo = await this.getBase64Image();
    if (image) {
      return await this.uploadImage(image, path, fileName);
    } else {return undefined;}
  }

  public async getBase64Image(): Promise<Photo> {
    return Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });
  }

  public async uploadImage(photo: Photo, path: string, fileName: string): Promise<string> {
    const storage = getStorage();
    const imageRef = ref(storage, `${path}/${fileName}`);

    const snapshot = await uploadBytes(imageRef, this.b64toBlob(photo.base64String, 'image/jpg'));
    return await getDownloadURL(snapshot.ref);
  }

  public async download(url: string, fileName: string) {
    const base64Data = await this.readAsBase64(url);
    const image = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Documents
    });
  }

  private async readAsBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob);
  }

  private async convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  private b64toBlob(b64Data, contentType='', sliceSize=512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
  }
}
