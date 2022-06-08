import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isSubmission = false
  showAlert = false
  alertColor = ''
  alertMessage = ''

  credentials = {'email': '', 'password': ''}
  constructor(private auth: AngularFireAuth) { }

  ngOnInit(): void {
  }
  async login(){
    this.isSubmission = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMessage = 'Please wait! We are loggging you in.'

    try{
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email, this.credentials.password
      )
    }
    catch(err){
      this.alertColor = 'red'
      this.alertMessage = 'Something went wrong!'
      this.isSubmission = false
      return
    }
    this.alertColor = 'green'
    this.alertMessage = 'Success! You are no logged in.'
  }

}
