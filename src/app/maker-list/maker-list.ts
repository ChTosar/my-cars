import { Component, Input, WritableSignal, signal } from '@angular/core';
import { CarStateService } from '../state/car.state.service';
import { Brand } from '../models/cars.model';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-maker-list',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './maker-list.html',
  styleUrl: './maker-list.scss'
})
export class MakerList {

  brands = signal<Brand[]>([]);

  constructor(public carState: CarStateService) {}

  ngOnInit(): void {
    this.loadBrnads();
  }

  loadBrnads(): void {

    this.carState.getBrands().subscribe((brands: Brand[]) => {
      this.brands.set(brands);
    });

  }

  setBrand(brand: string): void {
    this.carState.setSelectedBrand(brand);
  }

}
