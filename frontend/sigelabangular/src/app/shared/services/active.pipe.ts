import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activo'
})
export class ActivePipe implements PipeTransform {

  transform(value: boolean): string {

    return value === true ? 'activo' : 'inactivo';

  }

}
