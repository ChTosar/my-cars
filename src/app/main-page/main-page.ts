import { Component, Signal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelsList } from '../models-list/models-list';
import { MakerList } from '../maker-list/maker-list';
import { CarStateService } from '../state/car.state.service';
import { Subscription } from 'rxjs';
import { Brand, Model, ModelsByYear, ModelStatus } from '../models/cars.model';
import { Api } from '../services/api.service';
import { CarShow } from '../car-show/car-show';

@Component({
  selector: 'app-main-page',
  imports: [ModelsList, MakerList, CarShow],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss'
})
export class MainPage {

  private modelsSub?: Subscription;
  brands = signal<Brand[]>([]);
  private brandsSub?: Subscription;
  models = signal<ModelsByYear[]>([])
  car?: { brand: string, model: ModelStatus, imgs: Signal<string[]> };
  currentBrand?: string;

  constructor(private route: ActivatedRoute, private router: Router, private carState: CarStateService, private api: Api) { }

  ngOnInit(): void {
    this.loadBrnads();
    this.loadModels();

    this.route.paramMap.subscribe(params => {
      setTimeout(() => { //TODO buscar algún evento

        if (params.get('id')) {
          this.carState.setSelectedBrand(params.get('id'));
          const container = document.querySelector('.container');
          container?.scrollTo({
            left: container.scrollWidth,
            behavior: 'smooth'
          });
        }

      }, 100)
    });
  }

  loadModels(): void {
    this.modelsSub = this.carState.getModels().subscribe((models: Model[]) => {
      this.models.set(this.groupByYear(models));
    });
  }

  groupByYear(models: Model[]): ModelsByYear[] {
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

    return modelsByYear;
  }

  loadMoreModels() {
    this.carState.loadMoreModels();
  }

  loadBrnads(): void {
    this.brandsSub = this.carState.brandsObservable().subscribe((brands: Brand[]) => {
      this.brands.set(brands);
    });
  }

  showCar(model: ModelStatus) {

    const imgs = signal<string[]>([]);

    model.color.then((color) => {
      imgs.set(this.api.get360Imgs(this.currentBrand as string, model.model, model.year, color));
    });

    this.car = {
      brand: this.currentBrand as string,
      model,
      imgs
    }
  }

  closeCarShow() {
    this.car = undefined;
  }

  setBrand(brand: string): void {
    this.currentBrand = brand;
    this.carState.setSelectedBrand(this.currentBrand);
    const container = document.querySelector('.container');
    container?.scrollTo({
      left: container.scrollWidth,
      behavior: 'smooth'
    });
    this.router.navigate(['', brand]);
  }

  close() {

    this.brandsSub?.unsubscribe();
    //this.carShow.set(false);
    this.modelsSub?.unsubscribe();
  }

  back() {
    document.querySelector('.container')?.scrollTo({
      left: 0,
      behavior: 'smooth'
    });

    //this.router.navigate(['']);
  }

}
