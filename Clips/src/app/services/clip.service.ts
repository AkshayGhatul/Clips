import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import IClip from '../models/clip.modal';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>
  constructor(private db: AngularFirestore) { 
    this.clipsCollection = db.collection('clips')
  }

  createClip(clip: IClip): Promise<DocumentReference<IClip>>{
    return this.clipsCollection.add(clip)
  }
}
