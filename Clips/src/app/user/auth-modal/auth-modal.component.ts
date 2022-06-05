import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit, OnDestroy {
  modalID = 'auth'
  constructor(public modal: ModalService) { }

  ngOnInit(): void {
    this.modal.register(this.modalID)
  }
  ngOnDestroy(): void {
      this.modal.unRegister(this.modalID)
  }
}
