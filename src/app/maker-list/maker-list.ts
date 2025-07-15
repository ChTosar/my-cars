import { Component, signal } from '@angular/core';
import { CarStateService } from '../state/car.state.service';
import { Brand } from '../models/cars.model';
import { AsyncPipe } from '@angular/common';
import { Search } from '../search/search';
import { Subscription } from 'rxjs';

type BrandList = Brand & { errorImg?: boolean };
@Component({
  selector: 'app-maker-list',
  standalone: true,
  imports: [AsyncPipe, Search],
  templateUrl: './maker-list.html',
  styleUrl: './maker-list.scss'
})
export class MakerList {

  brands = signal<BrandList[]>([]);
  private brandsSub?: Subscription;

  constructor(public carState: CarStateService) { }

  ngOnInit(): void {
    this.loadBrnads();
  }

  loadBrnads(): void {

    this.brandsSub = this.carState.brandsObservable().subscribe((brands: Brand[]) => {
      this.brands.set(brands);
    });

  }

  setBrand(brand: string): void {
    this.carState.setSelectedBrand(brand);
    document.querySelector('app-models-list')?.scrollTo({ top: 0 });
  }

  onSearch(searchTerm: any): void {
    const filteredBrands = this.carState.getBrands().filter(brand => brand.make.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filteredBrands.length === 0 || filteredBrands.length === this.carState.getBrands().length) {
      this.loadBrnads();
    } else {
      this.brands.set(filteredBrands);
      this.brandsSub?.unsubscribe();
    }

  }

  ngOnDestroy(): void {
    this.brandsSub?.unsubscribe();
  }

}
