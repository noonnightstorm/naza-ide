import {Directive,ElementRef,EventEmitter,OnDestroy,OnInit} from '@angular/core';

@Directive({
  selector: 'nz-ace,[nz-ace]',
  inputs:['aceCode','aceConfig'],
  outputs:['aceCodeChange','aceInstance'],
  exportAs:'nzAce'
})
export class nzAce implements OnDestroy,OnInit{
  private _el:HTMLElement;
  public aceEditor:any;
  public aceCode:string;
  public aceCodeChange: EventEmitter<any> = new EventEmitter();
  public aceInstance:EventEmitter<any> = new EventEmitter();
  private _config={
    // ace font size
    fontSize: '12px',
    // ace font family
    fontFamily: 'Monaco, Menlo, \'Ubuntu Mono\', Consolas, source-code-pro, monospace',
    // ace text theme
    theme: 'monokai',
    // ace text mode
    mode: 'html',
    // show line number gutter
    showGutter: true,
    // wrap code
    useWrapMode: true,
    // show invisible tab
    showInvisibles: false,
    // show indent
    displayIndentGuides: true,
    // soft tabs or hard tab
    useSoftTabs: true,
    // show print margin
    showPrintMargin: true,
    // enable snippets
    enableSnippets: true,
    // enable basic auto completion
    enableBasicAutocompletion: true,
    // enable live auto completion
    enableLiveAutocompletion: true,
    // readonly
    readOnly:false
  };
  public set aceConfig(config){
    Object.assign(this._config,config);
    this.renderAce(this.aceEditor,this._config,this.aceCode);
  }
  public renderAce = (aceEditor,config,code)=>{
    aceEditor.$blockScrolling = Infinity;
    let session = aceEditor.getSession();
    if(null !== code){
      session.setValue(code);
    }
    aceEditor.setOption("enableEmmet", true);
    aceEditor.setTheme('ace/theme/' + config.theme);
    session.setMode('ace/mode/' + config.mode);
    aceEditor.renderer.setShowGutter(config.showGutter);
    session.setUseWrapMode(config.useWrapMode);
    aceEditor.renderer.setShowInvisibles(config.showInvisibles);
    aceEditor.renderer.setDisplayIndentGuides(config.displayIndentGuides);
    session.setUseSoftTabs(config.useSoftTabs);
    aceEditor.setShowPrintMargin(config.showPrintMargin);
    aceEditor.setFontSize(config.fontSize);
    aceEditor.setOption('enableSnippets', config.enableSnippets);
    aceEditor.setOption('enableBasicAutocompletion', config.enableBasicAutocompletion);
    aceEditor.setOption('enableLiveAutocompletion', config.enableLiveAutocompletion);
    aceEditor.setReadOnly(config.readOnly);
    let aceChange = () => {
      this.aceCodeChange.emit(session.getValue());
    };
    session.removeListener('change', aceChange);
    session.on("change", aceChange);
  };
  constructor(element:ElementRef){
    this._el = element.nativeElement;
    this._el.classList.add('nz_ace');
    this.aceEditor = ace.edit(this._el);
  }
  ngOnInit(){
    this.aceInstance.emit(this.aceEditor);
    this.renderAce(this.aceEditor,this._config,this.aceCode);
  }
  ngOnDestroy(){
    this.aceEditor.session.$stopWorker();
    this.aceEditor.destroy();
  }
}
