import { Injectable } from '@angular/core';
import { createFFmpeg } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isReady = false
  private ffmpeg

  constructor() {
    this.ffmpeg = createFFmpeg()
  }

  async init(){
    if(this.isReady){
      return
    }
    await this.ffmpeg.load()
    this.isReady = true
  }
}
