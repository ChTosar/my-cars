import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { debounceTime, fromEvent, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class Search {

  @Input() placeholder: string = 'Search...';
  @Output() searchEvent = new EventEmitter<string>();
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  private subscription!: Subscription;

  ngAfterViewInit(): void {
    this.subscription = fromEvent<Event>(this.searchInput.nativeElement, 'input').pipe(
      map((event: Event) => (event.target as HTMLInputElement).value),
      debounceTime(300)
    ).subscribe(value => {
      this.searchEvent.emit(value);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
