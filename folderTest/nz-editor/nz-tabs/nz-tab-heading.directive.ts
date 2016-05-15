import {Directive, TemplateRef} from '@angular/core';
import {nzTab} from './nz-tab.component';

@Directive({selector: '[nzTabHeading]'})
export class nzTabHeading {
  public constructor(templateRef:TemplateRef<any>, tab:nzTab) {
    tab.tplRef = templateRef;
  }
}
