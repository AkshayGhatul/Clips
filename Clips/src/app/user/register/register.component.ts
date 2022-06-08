import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(
    private auth: AuthService,
  ){}
  isSubmission = false
  showAlert = false
  alertColor = ''
  alertMessage = ''
  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ])
  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ])
  age = new FormControl('', [
    Validators.required,
    Validators.min(18)
  ])
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ])
  confirmPassword = new FormControl('', [
    Validators.required,
  ])
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.min(13),
    Validators.max(13),
    
  ])
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber,
  })
  async register(){
    this.isSubmission = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMessage = 'Please wait! Your account is being created.'
    try{
      await this.auth.registerUser(this.registerForm.value)
    }
    catch(err){
      this.alertColor = 'red'
      this.alertMessage = 'Something went wrong!'
      this.isSubmission = false
      return
    }
    this.alertColor = 'green'
    this.alertMessage = 'Success! Your account has been created.'
  }
}
