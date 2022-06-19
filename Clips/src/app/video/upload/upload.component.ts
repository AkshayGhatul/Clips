import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, OnDestroy {
  isDragOver = false
  file: File | null = null
  nextStep = false
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! Your clip is being uploaded.'
  insubmission = false
  percentage = 0
  showPerc = false
  user: firebase.User | null = null
  task?: AngularFireUploadTask

  title = new FormControl('',[
    Validators.required,
    Validators.minLength(3)
  ])
  uploadForm = new FormGroup({
    title: this.title
  })

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
  ) { 
    auth.user.subscribe(user=> this.user = user)
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.task?.cancel()  
  } 

  storeFile($event: Event){
    this.isDragOver= false
    this.file = ($event as DragEvent).dataTransfer ?
    ($event as DragEvent).dataTransfer?.files[0] ?? null: ($event.target as HTMLInputElement).files?.item(0) ?? null
    if( !this.file || this.file.type !== 'video/mp4'){
      return
    }
    this.nextStep = true
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''))
  }
  uploadFile(){
    this.uploadForm.disable()
    this.showPerc = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! Your clip is being uploaded.'
    this.insubmission = true

    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`
    try{
      this.task = this.storage.upload(clipPath, this.file)
      const clipRef = this.storage.ref(clipPath)
      this.task.percentageChanges().subscribe((progress)=>{
        this.percentage = progress as number / 100
      })
      this.task.snapshotChanges().pipe(
        last(),
        switchMap(()=> clipRef.getDownloadURL())
      ).subscribe({
        next: (url)=>{
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `${clipFileName}.mp4`,
            url,
          }
          this.clipService.createClip(clip)
          this.showPerc = false
          this.alertColor = 'green'
          this.alertMsg = 'Success! Your clip is now ready to share with the world.'
        },
        error: (err)=>{
          this.alertColor = 'red'
          this.alertMsg = 'Upload failed! Try again later.'
          this.insubmission = false
          this.showPerc = false
          this.uploadForm.enable()
        }
      })
    }
    catch{
      this.showAlert = true
      this.alertColor = 'red'
      this.alertMsg = 'Encoured an error! Try again later.'
      this.insubmission = false
      this.uploadForm.enable()
    }
  }

}
