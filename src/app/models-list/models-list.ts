import { Component, effect, ElementRef, EventEmitter, Input, Output, QueryList, signal, ViewChildren } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ModelStatus, ModelsByYear } from '../models/cars.model';


@Component({
  selector: 'app-models-list',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './models-list.html',
  styleUrl: './models-list.scss'
})
export class ModelsList {

  @Input() listModels = signal<ModelsByYear[]>([]);
  models = signal<ModelsByYear[]>([]);

  @Output() requestMore = new EventEmitter();
  @Output() modelSelected = new EventEmitter<ModelStatus>();

  @ViewChildren('modelsRef') itemRefs!: QueryList<ElementRef>;
  lasElementObsesrver: IntersectionObserver | null = null;

  constructor(private elRef: ElementRef) {}

  ngOnInit() {
    this.models = this.listModels // necesario para poder buscar después ??
  }

  //evento tras repintado de la lista
  ngAfterViewChecked(): void {
    this.lasElementObsesrver?.disconnect();
    this.loadMore();
  };

  loadMore() {
    const lastItem = this.itemRefs.last;

    if (lastItem) {
      this.lasElementObsesrver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          this.requestMore.emit();
        }
      });
      this.lasElementObsesrver.observe(lastItem.nativeElement);
    }
  }

  imgLoaded(model: ModelStatus): void {
    model.img.loaded = true;
  }

  show(model: ModelStatus): void {
    this.modelSelected.emit(model);
  }

}
