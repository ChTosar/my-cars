import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Brand, Model } from '../models/cars.model';
import { Api } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CarStateService {
  private brands$ = new BehaviorSubject<Brand[]>([]);
  private models$ = new BehaviorSubject<Model[]>([]);
  private selectedBrandId$ = new BehaviorSubject<string | null>(null);

  constructor(private api: Api) { }

  brandsObservable(): Observable<Brand[]> {
    if (this.brands$.getValue().length === 0) {
      this.loadBrands();
    }

    return this.brands$.asObservable();
  }

  getBrands(): Brand[] {
    return this.brands$.value;
  }

  getModels(): Observable<Model[]> {
    return this.models$.asObservable();
  }

  setSelectedBrand(brand: string | null): void {
    this.selectedBrandId$.next(brand);
    this.loadModels(brand as string);
  }

  getSelectedBrand(): Observable<string | null> {
    return this.selectedBrandId$.asObservable();
  }

  loadBrands(offset: Number = 0): void {
    this.api.getBrands(offset).subscribe(response => {

      const brands: Brand[] = this.constMapBrands(response.results);

      this.brands$.next([...this.brands$.getValue(), ...brands]);

      if (this.brands$.getValue().length < response.total_count) {
        this.loadBrands(this.brands$.getValue().length);
      }

    });
  }

  constMapBrands(apiResult: any): Brand[] {
    return apiResult.map((brand: any): Brand => ({
      make: brand.make,
      totalModels: null,
      models: []
    }));
  }


  loadModels(brand: string, offset: number = 0): void {
    const brands = this.brands$.getValue();
    const existingBrand = brands.find(b => b.make === brand) as Brand;
    const currentModels = existingBrand.models || [];

    if (offset === 0 && currentModels.length > 0) {
      this.models$.next(currentModels);
      return;
    }

    this.api.getModels(brand, offset).subscribe(response => {
      const newModels = response.results.map((model: any, index: number) => {
        const id = index + offset;

        const colors: Promise<any> = this.api.getCarColors(brand, model.model, model.year);
        const color: Promise<any> = this.api.randomColor(colors);

        return {
          id,
          model: model.model,
          basemodel: model.basemodel,
          year: model.year,
          colors,
          color,
          img: {
            src: this.api.getImg(brand, model.model, model.year, '200', color),
          }
        };
      });

      existingBrand.models = [...currentModels, ...newModels];
      this.models$.next(existingBrand.models);
      this.brands$.next(brands);
    });
  }

  loadMoreModels(): void {
    const brand = this.selectedBrandId$.getValue();
    const currentModels = this.models$.getValue();

    if (!brand || currentModels.length === 0) {
      return;
    }

    this.loadModels(brand, currentModels.length);
  }
}
