import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-operator-showcase',
  template: `
    <mat-card>
      <mat-card-content>
        <div class="content" [class.content-title]="title">
          <div class="column header">{{header}}</div>
          <div class="column">{{source}}</div>
          <div class="column">{{destination}}</div>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <ng-content></ng-content>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./operator-showcase.component.scss']
})
export class OperatorShowcaseComponent<R> {
  @Input() header: string;
  @Input() source: string;
  @Input() destination: string;
  @Input() title: boolean;
}
