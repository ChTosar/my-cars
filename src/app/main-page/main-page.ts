import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelsList } from '../models-list/models-list';
import { MakerList } from '../maker-list/maker-list';
import { CarStateService } from '../state/car.state.service';

@Component({
  selector: 'app-main-page',
  imports: [ModelsList, MakerList],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss'
})
export class MainPage {

  constructor(private route: ActivatedRoute, private router: Router, private carState: CarStateService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {

      setTimeout(() => { //TODO buscar algún evento

        this.carState.setSelectedBrand(params.get('id'));

        const container = document.querySelector('.container');
        container?.scrollTo({
          left: container.scrollWidth,
          behavior: 'smooth'
        });
      }, 100)

    });
  }

}
