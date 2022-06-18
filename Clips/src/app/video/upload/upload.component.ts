import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  isDragOver = false
  file: File | null = null
  nextStep = false
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! Your clip is being uploaded.'
  insubmission = false
  percentage = 0
  showPerc = false

  title = new FormControl('',[
    Validators.required,
    Validators.minLength(3)
  ])
  uploadForm = new FormGroup({
    title: this.title
  })

  constructor(private storage: AngularFireStorage) { }

  ngOnInit(): void {
  }

  storeFile($event: Event){
    this.isDragOver= false
    this.file = ($event as DragEvent).dataTransfer?.files[0] ?? null
    if( !this.file || this.file.type !== 'video/mp4'){
      return
    }
    this.nextStep = true
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''))
  }
  uploadFile(){
    this.showPerc = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! Your clip is being uploaded.'
    this.insubmission = true

    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`
    try{
      const task = this.storage.upload(clipPath, this.file)
      task.percentageChanges().subscribe((progress)=>{
        this.percentage = progress as number / 100
      })
      task.snapshotChanges().pipe(
        last()
      ).subscribe({
        next: (snapshot)=>{
          this.showPerc = false
          this.alertColor = 'green'
          this.alertMsg = 'Success! Your clip is now ready to share with the world.'
        },
        error: (err)=>{
          this.alertColor = 'red'
          this.alertMsg = 'Upload failed! Try again later.'
          this.insubmission = false
          this.showPerc = false
        }
      })
    }
    catch{
      this.showAlert = true
      this.alertColor = 'red'
      this.alertMsg = 'Encoured an error! Try again later.'
      this.insubmission = false
    }
  }

}
