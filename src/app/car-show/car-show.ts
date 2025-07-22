import { Component, ElementRef, EventEmitter, Input, Output, QueryList, signal, ViewChildren } from '@angular/core';
import { ModelStatus } from '../models/cars.model';
import { Api } from '../services/api.service';
import { CarStateService } from '../state/car.state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-car-show',
  standalone: true,
  imports: [],
  templateUrl: './car-show.html',
  styleUrl: './car-show.scss'
})
export class CarShow {

  @Input() car: ModelStatus = {} as ModelStatus;
  @Output() close = new EventEmitter<boolean>();
  @ViewChildren('views') viewsRefs!: QueryList<ElementRef>;
  private brandsSub?: Subscription;

  private interval: number | undefined;

  imgs = signal<string[]>([]);
  brand: string = '';
  loaded: number = 0;

  constructor(private api: Api, private carState: CarStateService) { }

  ngOnInit(): void {

    this.brandsSub = this.carState.getSelectedBrand().subscribe((brand) => {
      this.brand = brand as string;
    });

    this.car.color.then((color) => {
      this.imgs.set(this.api.get360Imgs(this.brand as string, this.car.model, this.car.year, color));

      if (this.interval) {
        clearInterval(this.interval);
      }
    });

  }

  imgLoaded() {

    console.log('imgLoaded', this.loaded);

    this.loaded++;

    console.log('this.loaded === this.imgs.length > ', this.loaded, this.imgs().length, this.loaded === this.imgs().length)

    if (this.loaded === this.imgs().length) {
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
      if (index >= this.imgs().length) {
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
