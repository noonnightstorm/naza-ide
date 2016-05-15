import {Directive, TemplateRef, ViewContainerRef, Inject} from '@angular/core';

@Directive({
  selector: '[nzTransclude]',
  properties: ['nzTransclude']
})
export class nzTransclude {
  public viewRef:ViewContainerRef;

  private _nzTransclude:TemplateRef<any>;

  private set nzTransclude(templateRef:TemplateRef<any>) {
    this._nzTransclude = templateRef;
    if (templateRef) {
      this.viewRef.createEmbeddedView(templateRef);
    }
  }

  private get nzTransclude():TemplateRef<any> {
    return this._nzTransclude;
  }

  public constructor(@Inject(ViewContainerRef) _viewRef:ViewContainerRef) {
    this.viewRef = _viewRef;
  }
}
