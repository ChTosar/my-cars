import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Brand } from '../models/cars.model';
import { Search } from '../search/search';

type BrandList = Brand & { errorImg?: boolean };
@Component({
  selector: 'app-maker-list',
  standalone: true,
  imports: [Search],
  templateUrl: './maker-list.html',
  styleUrl: './maker-list.scss'
})
export class MakerList {

  @Input() makers = signal<Brand[]>([]);
  @Output() setBrand = new EventEmitter<string>();
  brands = signal<BrandList[]>([]);
  selected: string = '';

  constructor() {}

  ngOnInit() {
    this.brands = this.makers;
  }

  onSearch(searchTerm: any): void {
    const brands = this.makers().filter(brand => brand.make.toLowerCase().includes(searchTerm.toLowerCase()));

    if (brands.length === 0 || brands.length === this.makers().length) {
      this.brands = this.makers;
    } else {
      this.brands = signal<Brand[]>(brands);
    }
  }

  select(input: string): void {
    this.setBrand.emit(input)
    this.selected = input;
  }

}
