import {Component,OnInit,EventEmitter,Input,Output} from '@angular/core';
@Component({
  selector:'nz-switch',
  template:`
    <span class="nz-switch" [class.checked]="_switchState" (click)="toggleSwitch()">
        <small></small>
        <input type="checkbox" [(ngModel)]="_switchState" style="display:none">
    </span>
  `,
  styles:[require('./nz-switch.css')]
})
export class nzSwitch implements OnInit{
  @Output()
  nzValueChange: EventEmitter<any> = new EventEmitter();
  @Input()
  public get nzValue():boolean {
    return this._switchState;
  }
  public set nzValue(value){
    this._switchState = value;
  }
  private _switchState:boolean = false;
  public toggleSwitch():void{
    this._switchState = !this._switchState;
    this.nzValueChange.emit(this._switchState);
  }
  ngOnInit(){}
}
