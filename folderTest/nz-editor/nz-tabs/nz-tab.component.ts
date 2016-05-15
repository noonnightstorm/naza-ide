import {Component,Input,Output,OnDestroy,OnInit,EventEmitter,HostBinding,ElementRef,TemplateRef} from '@angular/core';
import {nzTabSet} from "./nz-tabset.component";
@Component({
  selector:'nz-tab',
  template:`
    <div class="nz-tab-content">
      <ng-content></ng-content>
    </div>
  `,
  styles:[require('./nz-tab.scss')]
})
export class nzTab implements OnDestroy,OnInit{
  private _el:HTMLElement;
  private _active:boolean;
  public tabSet:nzTabSet;
  public tplRef:TemplateRef<any>;
  @HostBinding('class.active')
  @Input()
  public get active():boolean {
    return this._active;
  }
  @Output()
  public nzSelect:EventEmitter<nzTab> = new EventEmitter();
  @Output()
  public nzDeselect:EventEmitter<nzTab> = new EventEmitter();
  public set active(active:boolean){
    this._active = active;
    if(!active){
      this.nzDeselect.emit(this);
    }
    else{
      this.nzSelect.emit(this);
      this.tabSet.tabs.forEach((tab:nzTab)=>{
        if(tab != this&&tab.active != false){
          tab.active = false;
        }
      })
    }
  }
  constructor(tabSet:nzTabSet,element:ElementRef){
    this.tabSet = tabSet;
    this.tabSet.addTab(this);
    this._el = element.nativeElement;
  }
  public ngOnInit(){
    this._el.classList.add('nz-tab-pane');
  }
  public ngOnDestroy(){
    this.tabSet.removeTab(this);
  }

}
