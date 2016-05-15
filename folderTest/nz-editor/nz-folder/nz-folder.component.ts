import { TreeCollection } from './treeCollection';
import { TreeBranch } from './treeBranch';
import {
  Component,
  Input,
  Output,
  OnInit,
  DoCheck,
  IterableDiffers,
  OnDestroy,
  EventEmitter,
  ElementRef
} from '@angular/core';


const CLICK_DELAY:number = 700;

@Component({
  selector: 'nz-folder',
  directives: [
    //contextMenu
  ],
  template: require('./nz-folder.html'),
  styles: [require('./nz-folder.scss')]
})
export class nzFolder implements OnInit,OnDestroy,DoCheck{
  // private _menu: any;
  private treeCollection: TreeCollection;
  private _el: ElementRef;
  private _differ: any;
  public get el(): ElementRef{
    return this._el;
  }

  constructor(differs: IterableDiffers, el: ElementRef){
    this._el = el.nativeElement;
    this._differ = differs.find([]).create(null);
  }

  @Input()
  public set nzCollection(collection: TreeCollection){
    this.treeCollection = collection;
  }
  public get nzCollection(): TreeCollection{
    return this.treeCollection;
  }

  @Input()
  public set nzSelected(selected: any){
    this.treeCollection.select(selected);
  }
  public get nzSelected(): any{
    return this.treeCollection.select();
  }

  @Input()
  public get branches(): Array<TreeBranch>{
    return this.treeCollection.branches;
  }

  ngDoCheck() {
    if(this._differ.diff(this.branches)){
      this.nzChange.emit(null);
    }
  }

  @Output()
  public nzClick:EventEmitter<any> = new EventEmitter();
  @Output()
  public nzDblclick:EventEmitter<any> = new EventEmitter();
  @Output()
  public nzChange:EventEmitter<any> = new EventEmitter();

  private _timer: any;
  private _preTarget: any;
  private _clickTimes: number;
  public nzBranchClick(dBranch: TreeBranch, evt: any): void{
    if(evt.target !== this._preTarget){
      this._clickTimes = 0;
    }
    this._preTarget = evt.target;

    this._clickTimes++;  //count clicks
    if(this._clickTimes === 1) { //just click
      clearTimeout(this._timer);
      this.treeCollection.select(dBranch, (branch) => {
        this._timer = setTimeout(() => {
          this._clickTimes = 0;
          this.nzClick.emit(branch);
        }, CLICK_DELAY);
      });
    } else { //double click
      clearTimeout(this._timer);
      this._clickTimes = 0;
      this.nzDblclick.emit({
        branch: dBranch,
        spot: false
      });
    }
  }
  public nzBranchDblclick(dBranch: TreeBranch, evt: any): void{
    if(dBranch.limb){
      evt.stopPropagation();
      clearTimeout(this._timer);
      this._clickTimes = 0;
      this.nzDblclick.emit({
        branch: dBranch,
        spot: true
      });
    }
  }

  ngOnInit() {}
  ngOnDestroy(){}
}
