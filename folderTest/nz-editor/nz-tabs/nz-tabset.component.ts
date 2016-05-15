import {Component,OnInit,OnDestroy,ElementRef} from '@angular/core';
import {nzTab} from './nz-tab.component';
import {nzTransclude} from './nz-transclude.directive';
@Component({
  selector:'nz-tabset',
  directives:[nzTransclude],
  template: `
    <ul class="nz-nav-tabs" (click)="$event.preventDefault()" [hidden]="!tabs.length">
      <li *ngFor="let tab of tabs" class="nz-nav-item" [class.active]="tab.active">
        <a href="" class="nz-nav-link" [class.active]="tab.active" (click)="tab.active = true;">
          <span [nzTransclude]="tab.tplRef"></span>
        </a>
      </li>
    </ul>
    <ng-content></ng-content>`,
  styles:[require('./nz-tabset.scss')]
})
export class nzTabSet implements OnInit,OnDestroy{
  private _el;
  private _isDestroyed = false;
  public tabs:Array<nzTab> = [];

  public addTab(tab:nzTab){
    this.tabs.push(tab);
  }
  public removeTab(tab:nzTab):void {
    let index = this.tabs.indexOf(tab);
    if (-1 === index || this._isDestroyed) {
      return;
    }
    let newActiveIndex = this.getClosestTabIndex(index);
    if(-1 !== newActiveIndex){
      this.tabs[newActiveIndex].active = true;
    }
    this.tabs.splice(index, 1);
  }
  private getClosestTabIndex(index:number):number {
    let tabsLength = this.tabs.length;
    if (!tabsLength) {
      return -1;
    }
    for (let step = 1; step <= tabsLength; step += 1) {
      let prevIndex = index - step;
      let nextIndex = index + step;
      if (this.tabs[nextIndex]) {
        return nextIndex;
      }
      if (this.tabs[prevIndex]) {
        return prevIndex;
      }
    }
    return -1;
  }
  public ngOnInit():void{
    this._el.classList.add('nz-tab-container');
  }
  public ngOnDestroy():void{
    this._isDestroyed = true;
  }
  constructor(el:ElementRef){
    this._el = el.nativeElement;
  }
}
