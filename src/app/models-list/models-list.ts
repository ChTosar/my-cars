import { Component, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Model } from '../models/cars.model';
import { CarStateService } from '../state/car.state.service';

@Component({
  selector: 'app-models-list',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './models-list.html',
  styleUrl: './models-list.scss'
})
export class ModelsList {

  models = signal<Model[]>([]);
  brand: string | null = null;

  constructor(private carState: CarStateService) {
    this.carState.getModels().subscribe((models: Model[]) => {
      this.models.set(models);
    });
  }

  imgLoaded(model: Model): void {
    model.img.loaded = true;
  }
}
