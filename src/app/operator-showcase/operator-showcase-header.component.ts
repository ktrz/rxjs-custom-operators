import {Component} from '@angular/core';

@Component({
  selector: 'app-operator-showcase-header',
  template: `
    <mat-card>
      <mat-card-content>
        <div class="content content-title">
          <div class="column">Source</div>
          <div class="column">Result</div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./operator-showcase.component.scss']
})
export class OperatorShowcaseHeaderComponent {
}
