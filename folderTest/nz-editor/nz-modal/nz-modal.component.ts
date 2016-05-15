import {Component,OnInit,EventEmitter,Input,Output} from '@angular/core';
@Component({
  selector:'nz-modal',
  template:`
    <div [ngSwitch]="_nzModalType" *ngIf="_nzModalType" class="modal" [class.fade]="_nzModalType" [class.in]="_nzModalType">
      <div class="modal-dialog">
        <div class="modal-content">
          <div *ngSwitchWhen="'newFile'">
            <div class="modal-header">
              <h4 class="modal-title">New File</h4>
              <i class="nz-iconfont icon-cross modal-close-icon" (click)="destroyModal()"></i>
            </div>
            <div class="modal-body">
              <form class="modal-form" (ngSubmit)="triggerEvent('newFile',newFile)">
                <div class="form-wrap">
                  <label for="name">FileName:</label>
                  <input type="text" class="form-input" required autofocus
                    [(ngModel)]="newFile.fileName"
                      ngControl="newFileName"  #newFileName="ngForm" >
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" (click)="triggerEvent('newFile',newFile)">OK</button>
              <button type="button" class="btn btn-default" (click)="destroyModal()">Close</button>
            </div>
          </div>
          <div *ngSwitchWhen="'deleteFile'">
            <div class="modal-header">
              <h4 class="modal-title">Delete File</h4>
              <i class="nz-iconfont icon-cross modal-close-icon" (click)="destroyModal()"></i>
            </div>
            <div class="modal-body">
              <p>Are you sure to delete this file?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" (click)="triggerEvent('deleteFile')">Delete</button>
              <button type="button" class="btn btn-default" (click)="destroyModal()">Close</button>
            </div>
          </div>
          <div *ngSwitchWhen="'newFolder'">
            <div class="modal-header">
              <h4 class="modal-title">New Folder</h4>
              <i class="nz-iconfont icon-cross modal-close-icon" (click)="destroyModal()"></i>
            </div>
            <div class="modal-body">
    
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" (click)="triggerEvent('newFolder')">OK</button>
              <button type="button" class="btn btn-default" (click)="destroyModal()">Close</button>
            </div>
          </div>
          <div *ngSwitchWhen="'deleteFolder'">
            <div class="modal-header">
              <h4 class="modal-title">Delete Folder</h4>
              <i class="nz-iconfont icon-cross modal-close-icon" (click)="destroyModal()"></i>
            </div>
            <div class="modal-body">
              <p>Are you sure to delete this folder?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" (click)="triggerEvent('deleteFolder')">Delete</button>
              <button type="button" class="btn btn-default" (click)="destroyModal()">Close</button>
            </div>
          </div>
          <div *ngSwitchDefault>Error</div>
        </div>
      </div>
    </div>

  `,
  styles:[require('./nz-modal.scss')]
})
export class nzModal implements OnInit{
  private _nzModalType=null;
  private newFile ={
    fileName:''
  };
  @Input()
  set nzModalType(value){
    this._nzModalType  = value;
  }
  get nzModalType(){
    return this._nzModalType;
  }
  @Output()
  modalResolve: EventEmitter<any> = new EventEmitter();
  @Output()
  nzModalTypeChange: EventEmitter<any> = new EventEmitter();
  triggerEvent=(type,model)=>{
    this._nzModalType = null;
    this.nzModalTypeChange.emit(this._nzModalType);
    this.modalResolve.emit({type:type,model:model})
  };
  destroyModal(){
    this._nzModalType = null;
    this.nzModalTypeChange.emit(this._nzModalType);
  }
  ngOnInit(){}
}
