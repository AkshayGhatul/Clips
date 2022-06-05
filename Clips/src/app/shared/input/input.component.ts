import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  @Input() type = 'text'
  @Input() placeholder = ''
  @Input() control:FormControl = new FormControl()
  @Input() format = ''
  constructor() { }

  ngOnInit(): void {
  }

}
