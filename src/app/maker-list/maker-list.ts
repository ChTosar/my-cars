import { Component, signal } from '@angular/core';
import { CarStateService } from '../state/car.state.service';
import { Brand } from '../models/cars.model';
import { AsyncPipe } from '@angular/common';
import { Search } from '../search/search';

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

  constructor(public carState: CarStateService) { }

  ngOnInit(): void {
    this.loadBrnads();
  }

  loadBrnads(): void {

    this.carState.brandsObservable().subscribe((brands: Brand[]) => {
      this.brands.set(brands);
    });

  }

  setBrand(brand: string): void {
    this.carState.setSelectedBrand(brand);
  }

  onSearch(searchTerm: any): void {
    const filteredBrands = this.carState.getBrands().filter(brand => brand.make.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filteredBrands.length === 0) {
      this.brands.set(this.carState.getBrands());
    } else {
      this.brands.set(filteredBrands);
    }

  }

}
