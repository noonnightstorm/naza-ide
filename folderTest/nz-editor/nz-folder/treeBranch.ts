// Branch Dom's classNames
const PREFIX = 'nz-tree-icon';
const LIMB_EXPANED_CLS = PREFIX + '-expaned';
const LIMB_CLS = PREFIX + '-closed';
const LEAF_CLS = PREFIX + '-leaf';

// # TreeBranch
export class TreeBranch{
  private _uuid: string;
  private _isLeaf: boolean;
  private _children: Array<TreeBranch>;//node has children that is a limb
  private _expanded: boolean; //branch is expaned or not

  public hidden: boolean;
  public parent: TreeBranch;
  public name: string;
  public path: string;
  public level: number;
  public selected: boolean; //has selected

  public set id(id: string){
    if(id === undefined){
      this._uuid = new Date().getTime() + '';
    }else{
      this._uuid = id;
    }
  }
  public get id(): string{
    return this._uuid;
  }

  public set leaf(isLeaf: boolean){
    this._isLeaf = isLeaf;
  }
  public get leaf(): boolean{
    return this._isLeaf;
  }
  public get limb(): boolean{
    return !this._isLeaf;
  }

  public set children(cs: Array<any>){
    this.record.children = cs;          //record must has children property
    if(cs){
      this._children = cs.map(child => {
        let pBranch = new TreeBranch(child, this);
        return this.parent = pBranch;
      });
    }else{
      this._children = [];
    }
  }
  public get children(): Array<any>{
    return this._children;
  }

  public get icon(): string{
    let typeCls = PREFIX + '-' + this.record.type;
    if(this._isLeaf){
      return LEAF_CLS + ' ' + typeCls;
    }else{
      if(this.expanded){
        return LIMB_EXPANED_CLS + ' ' + typeCls;
      }else{
        return LIMB_CLS + ' ' + typeCls;
      }
    }
  }

  public set expanded(_expanded: boolean){
    this._expanded = _expanded;
    let hidden = !_expanded;
    this.children.forEach(child => {
      child.hidden = hidden;
    });
  }
  public get expanded(): boolean{
    return this._expanded;
  }

  constructor(
    private record: any,    //origin item of contents
    pBranch?: TreeBranch
  ){
    if(Object(record) === record){
      this.name = record.name || 'unknown';
    }else{
      this.name = record;
    }

    if(pBranch){
      this.path = pBranch.path + this.name + '/';
      this.level = pBranch.level + 1;
    }else{
      this.path = '/';
      this.level = 0;
    }

    this.leaf = !!record.type; //record must has type property
    this.children = record.children;

    if(pBranch && this.children.length){
      this._expanded = true;
    }
  }
}
