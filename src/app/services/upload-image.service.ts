import { Injectable } from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import firebase from "firebase/compat/app";
import {Platform} from "@ionic/angular";
import {UserService} from "./user.service";
import {Filesystem} from "@capacitor/filesystem";
import {updateProfile} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  constructor(private platform: Platform,
              private userService: UserService)  { }

  public async selectImage(){
    const image: Photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });
    if(image){
      this.saveImage(image);
    }
  }

  private async saveImage(photo: Photo){
    const base64Data = await this.readAsBase64(photo);
    const fileName = new Date().getTime() + this.userService.getUser().uid + '.jpeg';
    const IMAGE_DIR = 'profile-images';

    firebase.storage().ref(IMAGE_DIR).child(fileName)
      .putString(base64Data.substring(22), 'base64').then(()=>{

      let imageRef = firebase.storage().ref(`${IMAGE_DIR}/${fileName}`);
      imageRef.getDownloadURL().then((res)=>{
        // Probleme ici !
        updateProfile(this.userService.getUser(), {photoURL: res});
      })
      //Todo: Update in database.
    })
  }

  private async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path
      });
      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
