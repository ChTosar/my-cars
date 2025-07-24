import { Component, ElementRef, EventEmitter, Input, Output, QueryList, Signal, signal, ViewChildren } from '@angular/core';
import { ModelStatus } from '../models/cars.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-car-show',
  standalone: true,
  imports: [],
  templateUrl: './car-show.html',
  styleUrl: './car-show.scss'
})
export class CarShow {

  @Input() car: { brand: string, model: ModelStatus, imgs: Signal<string[]>} = {} as any; //?

  @Output() close = new EventEmitter<boolean>();
  @ViewChildren('views') viewsRefs!: QueryList<ElementRef>;
  private brandsSub?: Subscription;

  private interval: number | undefined;

  loaded: number = 0;

  constructor() {}

  imgLoaded() {

    this.loaded++;

    if (this.loaded === this.car.imgs().length) {
      this.animate();
    }

  }

  animate() {

    let index = 0;
    let prevView: any = null;

    this.interval = setInterval(() => {

      const view = this.viewsRefs.toArray()[index];

      if (view) {
        requestAnimationFrame(() => {
          if (prevView) {
            prevView.nativeElement.style.display = '';
          }
          view.nativeElement.style.display = 'block';
          prevView = view;
        })
      }

      index++;
      if (index >= this.car.imgs().length) {
        index = 0;
      }

    }, 120);
  }

  closeMe() {
    this.close.emit(true);
    clearInterval(this.interval);
    this.brandsSub?.unsubscribe();
  }

}
