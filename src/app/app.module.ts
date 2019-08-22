import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {OperatorShowcaseModule} from './operator-showcase/operator-showcase.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    OperatorShowcaseModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
