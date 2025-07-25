import { Component, ElementRef, EventEmitter, HostListener, Input, model, Output, QueryList, signal, ViewChildren } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ModelStatus, ModelsByYear } from '../models/cars.model';
import { Search } from '../search/search';


@Component({
  selector: 'app-models-list',
  standalone: true,
  imports: [AsyncPipe, Search],
  templateUrl: './models-list.html',
  styleUrl: './models-list.scss'
})
export class ModelsList {

  @Input() listModels = signal<ModelsByYear[]>([]);
  models = signal<ModelsByYear[]>([]);

  @Output() requestMore = new EventEmitter();
  @Output() modelSelected = new EventEmitter<ModelStatus>();
  @Output() search = new EventEmitter<string>();

  @ViewChildren('modelsRef') itemRefs!: QueryList<ElementRef>;
  lasElementObsesrver: IntersectionObserver | null = null;
  lastItem?: ElementRef;
  filtering: boolean = false;

  constructor(private elRef: ElementRef) { }

  ngOnInit() {
    this.models = this.listModels;
  }

  ngAfterViewChecked(): void {
    this.loadMore();
  }

  @HostListener('scroll', ['$event'])
  onScroll(e: Event): void {
    this.loadMore();
  };

  loadMore() {
    //request only for the last element not loaded by a search
    const lasOffset = this.itemRefs.filter(ref => ref.nativeElement.hasAttribute('idoffset')).at(-1);

    if (this.filtering === false && ( lasOffset && this.lastItem !== lasOffset)) {
      this.lastItem = lasOffset;

      this.lasElementObsesrver?.disconnect();
      this.lasElementObsesrver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          this.requestMore.emit();
        }
      });

      this.lasElementObsesrver.observe(this.lastItem.nativeElement);
    }
  }

  imgLoaded(model: ModelStatus): void {
    model.img.loaded = true;
  }

  onSearch(searchTerm: any): void {
    this.search.emit(searchTerm);
    this.filtering = searchTerm.length > 0;
  }

  show(model: ModelStatus): void {
    this.modelSelected.emit(model);
  }

}
