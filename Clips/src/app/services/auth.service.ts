import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import IRegisterUser from 'src/app/models/user.models';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map, delay, filter, switchMap, of, isObservable } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<IRegisterUser> 
  public isAuthenticated$: Observable<boolean>
  public isAuthenticatedWithDelay$: Observable<boolean>
  private redirect = false

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
  ) { 
    this.userCollection = this.db.collection<IRegisterUser>('users')
    this.isAuthenticated$ = auth.user.pipe(
      map(user=>!!user)
    )
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    )
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({}))
    ).subscribe((data)=>{
      this.redirect = data?.['authOnly'] ?? false
    })
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
  public async logout($event:Event){
    $event.preventDefault()
    await this.auth.signOut()
    if(this.redirect){
      await this.router.navigateByUrl('/')
    }
  }
}
