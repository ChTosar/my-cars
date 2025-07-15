import { Component, ElementRef, QueryList, signal, ViewChildren } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Model, ModelStatus } from '../models/cars.model';
import { CarStateService } from '../state/car.state.service';
import { CarShow } from '../car-show/car-show';
import { Subscription } from 'rxjs';

interface ModelsByYear {
  year: string,
  models: ModelStatus[];
}
@Component({
  selector: 'app-models-list',
  standalone: true,
  imports: [AsyncPipe, CarShow],
  templateUrl: './models-list.html',
  styleUrl: './models-list.scss'
})
export class ModelsList {

  models = signal<ModelsByYear[]>([]);
  carShow = signal(false);
  modelSelect = signal<ModelStatus>({} as ModelStatus);
  private modelsSub?: Subscription;

  @ViewChildren('modelsRef') itemRefs!: QueryList<ElementRef>;
  lasElementObsesrver: IntersectionObserver | null = null;

  constructor(private carState: CarStateService) {
    this.modelsSub = this.carState.getModels().subscribe((models: Model[]) => {

      //order models by year
      const modelsByYear: ModelsByYear[] = [];
      models.forEach(model => {
        const year = model.year;
        let yearGroup = modelsByYear.find(y => y.year === year);
        if (!yearGroup) {
          yearGroup = { year, models: [] };
          modelsByYear.push(yearGroup);
        }
        yearGroup.models.push(model as ModelStatus);
      });
      this.models.set(modelsByYear);

    });
  }

  //evento tras repintado de la lista
  ngAfterViewChecked(): void {
    this.lasElementObsesrver?.disconnect();
    this.loadMore();
  };


  loadMore() {
    const lastItem = this.itemRefs.last;

    if (lastItem) {
      this.lasElementObsesrver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          this.carState.loadMoreModels();
        }
      });
      this.lasElementObsesrver.observe(lastItem.nativeElement);
    }
  }

  imgLoaded(model: ModelStatus): void {
    model.img.loaded = true;
  }

  show(model: ModelStatus): void {
    this.modelSelect.set(model);
    this.carShow.set(true);
  }

  close() {
    this.carShow.set(false);
    this.modelsSub?.unsubscribe();
  }

}
