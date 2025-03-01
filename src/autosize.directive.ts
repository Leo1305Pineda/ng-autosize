import {Input, AfterViewInit, ElementRef, HostListener, Directive, Output, EventEmitter} from '@angular/core';
export class ResizedEvent {
   element: HTMLElement;
   width: number;
  newHeight: number;

  constructor(o: any) {
    this.element = o.element;
    this.width = o.width | 0;
    this.newHeight = o.height | 0;
  }
}

@Directive({
    selector: 'textarea[autosize]'
})
export class Autosize implements AfterViewInit {

    private el: HTMLElement;
    private _height: string;
    private _minHeight: string;
    private _maxHeight: string;
    private _lastHeight: number;
    private _clientWidth: number;

    @Input('height')
    get height() {
      return this._height;
    }
    set height(val: string) {
     this._height = val;
     this.updateHeight();
    }

    @Input('minHeight')
    get minHeight() {
      return this._minHeight;
    }
    set minHeight(val: string) {
      this._minHeight = val;
      this.updateMinHeight();
    }

    @Input('maxHeight')
    get maxHeight() {
      return this._maxHeight; 
    }
    set maxHeight(val: string) {
      this._maxHeight = val;
      this.updateMaxHeight();
    }

    @Output() resized = new EventEmitter<any>();



 @HostListener('window:resize', ['$event.target'])
    onResize(textArea: HTMLTextAreaElement) {
      //Only apply adjustment if element width had changed.
      if (this.el.clientWidth === this._clientWidth) return;
      this._clientWidth = this.element.nativeElement.clientWidth;
      this.adjust();
    }

 @HostListener('input',['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();  
  }

  constructor(public element: ElementRef){
    this.el = element.nativeElement;
    this._clientWidth = this.el.clientWidth;
  }

  ngAfterViewInit(): void{
    // set element resize allowed manually by user
    const style = window.getComputedStyle(this.el, null);
    if (style.resize === 'both') {
      this.el.style.resize = 'horizontal';
    }
    else if (style.resize === 'vertical') {
      this.el.style.resize = 'none';
    }
    // run first adjust
    this.adjust();
  }

  adjust(): void{
    // perform height adjustments after input changes, if height is different
    if (this.el.style.height == this.element.nativeElement.scrollHeight + "px") return;
    this.el.style.overflow = 'hidden';
    this.el.style.height = 'auto';
    this.el.style.height = this.el.scrollHeight + "px";
    this.resized.emit({element: this.el,width:  this.el.clientWidth, newHeight: this.el.clientHeight});
  }
  updateHeight(): void{
    // Set textarea min height if input defined
    this.el.style.height = this._height + 'px';
  }

  updateMinHeight(): void{
    // Set textarea min height if input defined
    this.el.style.minHeight = this._minHeight + 'px';
  }

  updateMaxHeight(): void{
    // Set textarea max height if input defined
    this.el.style.maxHeight = this._maxHeight + 'px';
  }

}
