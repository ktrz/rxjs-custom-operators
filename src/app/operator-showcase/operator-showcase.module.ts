import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatCardModule} from '@angular/material';
import {OperatorShowcaseContentComponent} from './operator-showcase-content.component';
import {OperatorShowcaseHeaderComponent} from './operator-showcase-header.component';
import {OperatorShowcaseComponent} from './operator-showcase.component';

@NgModule({
  declarations: [OperatorShowcaseComponent, OperatorShowcaseHeaderComponent, OperatorShowcaseContentComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
  ],
  exports: [OperatorShowcaseComponent, OperatorShowcaseHeaderComponent, OperatorShowcaseContentComponent],
})
export class OperatorShowcaseModule {
}
