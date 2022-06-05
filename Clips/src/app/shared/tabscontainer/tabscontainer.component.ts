import { Component, OnInit, ContentChildren, AfterContentInit, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabscontainer',
  templateUrl: './tabscontainer.component.html',
  styleUrls: ['./tabscontainer.component.css']
})
export class TabscontainerComponent implements OnInit, AfterContentInit {
  @ContentChildren(TabComponent) tabs:QueryList<TabComponent> = new QueryList()
  constructor() { }

  ngOnInit(): void {
  }
  ngAfterContentInit(): void {
    const activeTabs = this.tabs.filter(tab=> tab.active)
    if(activeTabs.length === 0 || !activeTabs ){
      this.selectTab(this.tabs.first)
    }
  }
  selectTab(tab:TabComponent):boolean{
    this.tabs.forEach(tab=> tab.active = false)
    tab.active = true
    return false
  }
}
