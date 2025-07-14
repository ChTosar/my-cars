import { Component, ElementRef, QueryList, signal, ViewChildren } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Model } from '../models/cars.model';
import { CarStateService } from '../state/car.state.service';

interface ModelsByYear {
  year: string,
  models: Model[];
}
@Component({
  selector: 'app-models-list',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './models-list.html',
  styleUrl: './models-list.scss'
})
export class ModelsList {

  models = signal<ModelsByYear[]>([]);
  brand: string | null = null;

  @ViewChildren('modelsRef') itemRefs!: QueryList<ElementRef>;
  lasElementObsesrver: IntersectionObserver | null = null;

  constructor(private carState: CarStateService) {
    this.carState.getModels().subscribe((models: Model[]) => {

      //order models by year
      const modelsByYear: ModelsByYear[] = [];
      models.forEach(model => {
        const year = model.year;
        let yearGroup = modelsByYear.find(y => y.year === year);
        if (!yearGroup) {
          yearGroup = { year, models: [] };
          modelsByYear.push(yearGroup);
        }
        yearGroup.models.push(model);
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

  imgLoaded(model: Model): void {
    model.img.loaded = true;
  }
}
