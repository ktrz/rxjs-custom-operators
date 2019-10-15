import {Component} from '@angular/core';

@Component({
  selector: 'app-operator-showcase-header',
  template: `
    <app-operator-showcase header="Operator" source="Source" destination="Result" [title]="true"></app-operator-showcase>
  `,
})
export class OperatorShowcaseHeaderComponent {
}
