import { Component, Input, WritableSignal, signal } from '@angular/core';
import { CarStateService } from '../state/car.state.service';
import { Brand } from '../models/cars.model';

@Component({
  selector: 'app-maker-list',
  standalone: true,
  imports: [],
  templateUrl: './maker-list.html',
  styleUrl: './maker-list.scss'
})
export class MakerList {

  brands = signal<Brand[]>([]);

  constructor(private carState: CarStateService) {}

  ngOnInit(): void {
    this.loadBrnads();
  }

  loadBrnads(): void {

    this.carState.getBrands().subscribe((brands: Brand[]) => {
      this.brands.set(brands);
    });

  }

  setBrand(brand: string): void {
    console.log('Selected brand:', brand);
    this.carState.setSelectedBrand(brand);
  }

}
