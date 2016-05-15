import {Component,ViewEncapsulation,OnInit,ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {AuthHttp, AuthConfig, AUTH_PROVIDERS} from 'angular2-jwt';
import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';
import {nzAce} from './nz-ace';
import {nzTabs} from './nz-tabs';
import {nzSwitch} from './nz-switch';
import {userService,User,FolderService} from '../service';


import {nzFolder} from './nz-folder';
import {TreeBranch} from './nz-folder/treeBranch';
import {TreeCollection} from './nz-folder/treeCollection';
import {Http, HTTP_PROVIDERS,URLSearchParams,Headers} from '@angular/http';

import {nzModal} from './nz-modal';
@Component({
  selector: 'nz-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    nzAce,
    nzTabs,
    nzSwitch,
    nzFolder,
    nzModal
  ],
  viewProviders: [HTTP_PROVIDERS, FolderService],
  encapsulation: ViewEncapsulation.None,
  template: require('./nz-editor.html'),
  styles:[
    require('./nz-editor.scss'),
    require('./nz-ace/nz-ace.scss')
  ]
})
export class nzEditor implements OnInit{
  public user:User;
  public modalType = null;
  public isDarkTheme:boolean = false;
  public workspaces:Array<any> = [
    {title: 'demo.html', code: require('./nz-editor.html'),active:true},
    {title: 'index.html', code: require('./nz-editor.html'), active: false}
  ];
  public currentWorkspace = this.workspaces.filter((item)=>item.active)[0];
  public aceConfig = {
    fontSize: '12px',
    theme: 'tomorrow',
    mode: 'html'
  };
  public fontSizeList=['12px','14px','16px','18px'];
  public newFile=()=>this.modalType = 'newFile';
  public confirmNewFile=(file)=>{
    this.folderService.addObject(
      this.folderService.explorer,{
      name: file.fileName,
      type: 1
    }).complete(res => {
      debugger;
      this.workspaces.push({title: file.fileName, code: '',active:true});
    });
  };
  public confirmDeleteFile=(tab)=>{
    this.closeWorkspace(tab);
  };
  public triggerFind=(workspace)=>workspace.instance.execCommand("find");
  public triggerUndo=(workspace)=>workspace.instance.execCommand("undo");
  public triggerRedo=(workspace)=>workspace.instance.execCommand("redo");
  public deleteFile=(workspace)=>{this.modalType = 'deleteFile';};
  public saveFile=(workspace)=>{};
  public changeFontSize=(fontSize)=>this.aceConfig = JSON.parse(JSON.stringify(Object.assign(this.aceConfig,{fontSize:fontSize})));
  public changeTheme=(isDarkTheme)=> {
    this.isDarkTheme = isDarkTheme;
    this.aceConfig   = JSON.parse(JSON.stringify(Object.assign(this.aceConfig, {theme: isDarkTheme ? 'monokai' : 'tomorrow'})));
  };
  public handlerModal=(data)=>{
    if(data.type=='newFile'){
      this.confirmNewFile(data.model);
    }
    if(data.type=='deleteFile'){
      this.confirmDeleteFile(this.currentWorkspace);
    }
    console.log(data.type)
  };
  public activeWorkspace(workspace):void {
    workspace.active = true;
    this.currentWorkspace = workspace;
    setTimeout(()=>{this.currentWorkspace.instance&&this.currentWorkspace.instance.focus()},1000)
  };
  public closeWorkspace(tab){
    this.workspaces.splice(this.workspaces.indexOf(tab),1);
  };

  public get treeCollection(){
    return this.folderService.explorer;
  }
  public folderClick(dBranch: TreeBranch): void{

  }
  public folderDblclick(evtObj: any): void{
    if(evtObj.branch.leaf) return;
    if(evtObj.branch.expanded){
      this.folderService.explorer.collapse(evtObj.branch);
    }else{
      if(evtObj.branch.children.length){
        this.folderService.explorer.expand(evtObj.branch, evtObj.branch.level);
      }else{

        this.folderService.explorer.append(evtObj.branch, [{name: 'hello'}, {name: 'world'}]);
      }
    }
  }
  public folderChange():void{
  }

  constructor(public folderService: FolderService,public router: Router,public _userService:userService,public _authHttp: AuthHttp) {
    this.folderService.explorer = new TreeCollection([
      {name: 'yuyi', type: 0, children: [
        {name: 'hello', type: 1},
        {name: 'world', type: 2}
      ]},
      {name: 'zhiheng', type: 0}
      ]);
  }

  ngOnInit() {
    if(tokenNotExpired()){
      this.user = this._userService.getUser();
      this.folderService.http = this._authHttp;
      this.folderService.getObjectList(this.folderService.explorer);
    }
    else{
      this.user = {
        name: '',
        uid: ''
      }
      this.router.parent.navigateByUrl('/login');
    }

  }
}
