import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabscontainerComponent } from './tabscontainer/tabscontainer.component';
import { TabComponent } from './tab/tab.component';


@NgModule({
  declarations: [
    ModalComponent,
    TabscontainerComponent,
    TabComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ModalComponent, TabscontainerComponent, TabComponent],
})
export class SharedModule { }
