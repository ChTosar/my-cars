import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Brand, Model } from '../models/cars.model';
import { AllVehicles } from '../services/all-vehicles';

@Injectable({
  providedIn: 'root'
})
export class CarStateService {
  private brands$ = new BehaviorSubject<Brand[]>([]);
  private models$ = new BehaviorSubject<Model[]>([]);
  private selectedBrandId$ = new BehaviorSubject<string | null>(null);

  constructor(private allVehicles: AllVehicles) { }

  getBrands(): Observable<Brand[]> {
    if (this.brands$.getValue().length === 0) {
      this.loadBrands();
    }

    return this.brands$.asObservable();
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

  loadBrands(offset: Number = 0 ): void {
    this.allVehicles.getBrands(offset).subscribe(response => {

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

  loadModels(brand: string): void {

    const brands = this.brands$.getValue();
    const existingBrand = brands.find(b => b.make === brand) as Brand;

    if (existingBrand.models.length > 0) {
      this.models$.next(existingBrand.models);
      return;
    }

    this.allVehicles.getModels(brand).subscribe(response => {

      const models = response.results.map((model: any) => ({
        model: model.model,
        basemodel: model.basemodel,
        year: model.year,
        img: {
          src: this.allVehicles.getImg(brand, model.model, model.year, '200'),
          loaded: false
        }
      }));

      existingBrand.models = models;
      this.brands$.next(brands);

      console.log('Brand updated? brand:', this.brands$.getValue().find(b => b.make === brand));

      this.models$.next(models);
    });
  }
}
