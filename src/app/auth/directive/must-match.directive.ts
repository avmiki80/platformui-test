import {Directive, Input} from '@angular/core';
import {FormGroup, NG_VALIDATORS, ValidationErrors} from '@angular/forms';
import {MustMatch} from './must-match';
/*
  Директива для возможности добавления ее в HTML компоненты
  Сравновает любые 2 значения между собой
  Может использоваться в валидаторах
 */
@Directive({
  selector: '[appMustMatch]',
  providers: [{provide: NG_VALIDATORS, useExisting: MustMatchDirective, multi: true}]
})
export class MustMatchDirective {

  constructor() { }
  @Input('appMustMatch') mustMatch: string[] = [];
  validate(formGroup: FormGroup): ValidationErrors{
    return MustMatch(this.mustMatch[0], this.mustMatch[1])(formGroup);
  }

}
