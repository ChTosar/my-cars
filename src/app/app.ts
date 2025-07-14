import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MakerList } from './maker-list/maker-list';
import { ModelsList } from './models-list/models-list';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MakerList, ModelsList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('my-cars');
  constructor() { }
}
