import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {

  @Input() set appUnless(condition: boolean) {
    
    if(!condition){
      this.vfReference.createEmbeddedView(this.templateRef);
    }else{
      this.vfReference.clear();
    }

  }

  constructor(private templateRef: TemplateRef<any>, private vfReference: ViewContainerRef) { 

  }

}