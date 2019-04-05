import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';
@Component({
  template: '<pre>{{data | json}}</pre>',
})
export class ShowJsonDataDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ShowJsonDataDialog) { }
}