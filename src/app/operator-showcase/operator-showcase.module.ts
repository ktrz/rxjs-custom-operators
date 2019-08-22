import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatCardModule} from '@angular/material';
import {OperatorShowcaseHeaderComponent} from './operator-showcase-header.component';
import {OperatorShowcaseComponent} from './operator-showcase.component';

@NgModule({
  declarations: [OperatorShowcaseComponent, OperatorShowcaseHeaderComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
  ],
  exports: [OperatorShowcaseComponent, OperatorShowcaseHeaderComponent],
})
export class OperatorShowcaseModule {
}
