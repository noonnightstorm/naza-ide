import { TreeBranch } from './treeBranch';

const EXPAND_LEVEL = Number.MAX_VALUE;

export class TreeCollection{
  private _collection: Array<TreeBranch>;
  private _branch: TreeBranch;
  private _expandLevel: number;
  private _branches: Array<TreeBranch>;

  public get branches(): Array<TreeBranch>{
    return this._branches;
  }

  public size(dBranch: TreeBranch): number{
    if(dBranch.children.length){
      return dBranch.children.length + dBranch.children.reduce((pchild, nchild) => this.size(pchild) + this.size(nchild));
    }else{
      return dBranch.children.length;
    }
  }

  public values(dBranch: TreeBranch): Array<TreeBranch>{
    if(dBranch.children.length){
      return dBranch.children.concat(
        dBranch.children.reduce((pchild, nchild) => {
          return this.values(pchild).concat(this.values(nchild));
        })
      )
    }else{
      return [];
    }
  }

  public _append(dBranch: TreeBranch, pBranch: TreeBranch): void{
    this._collection.push(dBranch);
    let pIndex = this._branches.indexOf(pBranch);
    let plen = this.size(pBranch);
    this._branches.splice(pIndex + plen + 1, 0, dBranch);
    this._branches.splice(pIndex + plen + 2, 0, ...this.values(dBranch));
  }
  public _prepend(dBranch: TreeBranch, pBranch: TreeBranch): void{
    this._collection.unshift(dBranch);
    let pIndex = this._branches.indexOf(pBranch);
    this._branches.splice(pIndex + 1, 0, dBranch);
    this._branches.splice(pIndex + 2, 0, ...this.values(dBranch));
  }

  public create(record: any, expandLevel: any): TreeBranch{
    let dBranch = new TreeBranch(record);
    if(dBranch.limb){
      if(dBranch.children.length){
        if(expandLevel === false){
          dBranch.expanded = true;
        }else{
          dBranch.expanded = dBranch.level < expandLevel;
        }
      }
    }
    return dBranch;
  }

  public set collection(content: Array<any>){
    let _branches: Array<TreeBranch> = [];
    this._collection = content.map(item => {
      let dBranch = this.create(item, this._expandLevel);
      _branches.push(dBranch);
      _branches = _branches.concat(this.values(dBranch));
      return dBranch;
    });
    this._branches = _branches;
  }

  public get collection(): Array<any>{
    return this._collection;
  }

  constructor(
    content: Array<any>,
    expandLevel?: number
  ){
    this._expandLevel = expandLevel || EXPAND_LEVEL;
    this.collection = content;
  }

  public parent(dBranch: TreeBranch): TreeBranch{
    return dBranch.parent;
  }

  public parents(dBranch: TreeBranch): TreeBranch{
    let pBranch = this.parent(dBranch);
    if(dBranch){
      return this.parents(dBranch);
    }else{
      return dBranch;
    }
  }

  public siblings(dBranch: TreeBranch): Array<TreeBranch>{
    let pBranch = this.parent(dBranch);
    if(pBranch){
      return pBranch.children;
    }
  }

  public nextSibling(dBranch: TreeBranch, isLimb: boolean): TreeBranch{
    let pBranch = this.parent(dBranch);
    let theBranch;
    let dirBranch;
    if(pBranch){
      for(let i = pBranch.children.length; i--;){
        let branch = pBranch.children[i];
        if(branch === dBranch){
          theBranch = pBranch.children[i + 1];
          break;
        }else if(branch.limb){
          dirBranch = branch;
        }
      }
      return isLimb ? dirBranch : theBranch;
    }
    return null;
  }

  public prevSibling(dBranch: TreeBranch, isLimb: boolean): TreeBranch{
    let pBranch = this.parent(dBranch);
    let theBranch;
    let dirBranch;
    if(pBranch){
      pBranch.children.every((branch, index) => {
        if(branch === dBranch){
          theBranch = pBranch.children[index - 1];
          return false;
        }else if(branch.limb){
          dirBranch = branch;
        }
      });
      return isLimb? dirBranch : theBranch;
    }
    return null;
  }

  public next(dBranch: TreeBranch, isLimb: boolean): TreeBranch{
    let children;
    if(isLimb){
      children = dBranch.children.filter(child => child.limb);
    }else{
      children = dBranch.children;
    }
    if(children.length){
      return children[0];
    }else{
      let closest_next = d => {
        let next = this.nextSibling(d, isLimb);
        if(next){
          return next;
        }else{
          let p = this.parent(d);
          if(p){
            return closest_next(p);
          }
        }
      }
      return closest_next(dBranch);
    }
  }

  public prev(dBranch: TreeBranch, isLimb: boolean): TreeBranch{
    let prev = this.prevSibling(dBranch, isLimb);
    if (prev) {
      let last_descendant = d => {
        let children;
        if (isLimb) {
          children = d.children.filter(c => c.limb);
        } else {
          children = d.children;
        }
        if (children.length) {
          return last_descendant(children[children.length - 1]);
        } else {
          return d;
        }
      }
      return last_descendant(prev);
    } else {
      return this.parent(dBranch);
    }
  }

  public expand(dBranch: TreeBranch, level?: number, bubble:boolean = false): void{
    level = level || dBranch.level + this._expandLevel;
    if (dBranch.level < level) {
      dBranch.expanded = true;
      if (bubble) {
        dBranch = this.parent(dBranch);
        if (dBranch) {
          this.expand(dBranch, level, bubble)
        }
      } else {
        dBranch.children.forEach(branch => this.expand(branch, level, false));
      }
    } else if (bubble) {
      dBranch = this.parent(dBranch);
      if (dBranch) {
        this.expand(dBranch, level, bubble)
      }
    }
  }

  public expandAll(expandLevel?: number): void{
    expandLevel = expandLevel || this._expandLevel;
    this._collection.forEach(branch => this.expand(branch, branch.level + expandLevel));
  }

  public collapse(dBranch: TreeBranch, level?: number, bubble:boolean = false): void{
    level = level || dBranch.level + this._expandLevel;
    if (dBranch.level < level) {
      dBranch.expanded = false;
      if (bubble) {
        dBranch = this.parent(dBranch);
        if (dBranch) {
          this.collapse(dBranch, level, bubble)
        }
      } else {
        dBranch.children.forEach(branch => this.collapse(branch, level, false))
      }
    } else if (bubble) {
      dBranch = this.parent(dBranch);
      if (dBranch) {
        this.collapse(dBranch, level, bubble)
      }
    }
  }

  public collapseAll(expandLevel: number): void{
    expandLevel = expandLevel || this._expandLevel;
    this._collection.forEach(branch => this.collapse(branch, branch.level + expandLevel));
  }

  public toggleExpand(dBranch: TreeBranch, level?: number, bubble:boolean = false): void{
    if (dBranch.expanded) {
      this.collapse(dBranch, level, bubble)
    } else {
      this.expand(dBranch, level, bubble)
    }
  }

  public find(checkFn: (dBranch: TreeBranch) => any): TreeBranch{
    let theBranch: TreeBranch;
    this._branches.every(branch => {
      if(checkFn(branch)){
        theBranch = branch;
        return false;
      }
    });
    return theBranch;
  }

  public branch(record: any): TreeBranch{
    let theBranch: TreeBranch;
    switch(typeof record){
      case 'number':
        theBranch = this._collection[record];
        break;
      case 'string':
        theBranch = this.find(branch => branch.id == record);
        break;
      case 'object':
        if(record instanceof TreeBranch){
          theBranch = record
        }else{
          theBranch = this.find(branch => branch.id == record.id);
        }
        break;
      default:
        break;
    }
    return theBranch;
  }

  public deselect(): void{
    if(this._branch){
      this._branch.selected = false;
      this._branch = null;
    }
  }

  public select(record?: any, callback?: (dBranch: TreeBranch) => any, isParent?: boolean): TreeBranch{
    if(!arguments.length){
      return this._branch;
    }
    let dBranch = this.branch(record);
    if(dBranch){
      if(isParent){
        let pBranch = this.parent(dBranch);
        if(pBranch) dBranch = pBranch;
      }
      if(this._branch !== dBranch){
        this.deselect();
        this._branch = dBranch;
        this._branch.selected = true;
      }
      callback && callback(dBranch);
    }else{
      this.deselect();
    }
    return dBranch;
  }

  remove(record: any): TreeBranch{
    let dBranch = this.branch(record);
    let pBranch = this.parent(dBranch);
    if(dBranch){
      if(pBranch){
        let pIndex = this._branches.indexOf(pBranch);
        let dIndex = pBranch.children.indexOf(dBranch);
        pBranch.children.splice(dIndex, 1);
        this._branches.splice(pIndex + dIndex + 1, 1);
      }
    }
    return dBranch;
  }

  append(record?: any, children: Array<any> = []): TreeBranch{
    let dBranch;
    if(record){
      dBranch = this.branch(record);
      let pIndex;
      let plen;
      if(dBranch){
        pIndex = this._branches.indexOf(dBranch);
        plen = this.size(dBranch);
      }else{
        dBranch = this.create(record, this._expandLevel);
        this._collection.unshift(dBranch);
        this._branches.unshift(dBranch);
        pIndex = 0;
        plen = 0;
      }
      dBranch.children = children;
      children = this.values(dBranch);
      this._branches.splice(pIndex + 1, plen, ...children);
      dBranch.expanded = true;
    }else{
      children.forEach(child => {
        let dBranch = this.create(child, this._expandLevel);
        let cs = this.values(dBranch);
        this._collection.push(dBranch);
        this._branches.push(dBranch);
        this._branches.push(...cs);
      });
    }
    return dBranch;
  }
}
