import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import IRegisterUser from 'src/app/models/user.models';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map, delay } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<IRegisterUser> 
  public isAuthenticated$: Observable<boolean>
  public isAuthenticatedWithDelay$: Observable<boolean>
  constructor(private auth:AngularFireAuth, private db: AngularFirestore) { 
    this.userCollection = this.db.collection<IRegisterUser>('users')
    this.isAuthenticated$ = auth.user.pipe(
      map(user=>!!user)
    )
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    )
  }
  async registerUser(userData: IRegisterUser){
    if (!userData.password){
      throw new Error("Password must not be empty.")
    }
    const userCrd = await this.auth.createUserWithEmailAndPassword(
      userData.email, userData.password
    )
    if(!userCrd.user){
      throw new Error("User couldn't be found.")
    }
    await this.userCollection.doc(userCrd.user?.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    })
    await userCrd.user.updateProfile({
      displayName: userData.name
    })
  }
}
