import { Component, signal } from '@angular/core';
import { CarStateService } from '../state/car.state.service';
import { Brand } from '../models/cars.model';
import { AsyncPipe } from '@angular/common';
import { Search } from '../search/search';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(public carState: CarStateService, private router: Router) { }

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
    const container = document.querySelector('.container');
    container?.scrollTo({
      left: container.scrollWidth,
      behavior: 'smooth'
    });

    this.router.navigate(['', brand]);

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
