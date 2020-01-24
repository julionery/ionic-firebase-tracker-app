import { Pipe, PipeTransform } from '@angular/core';

import { URL_IMAGENS } from "../../config/url.servicos";

@Pipe({
  name: 'imagem',
})
export class ImagemPipe implements PipeTransform {
  transform(value: string) {
    return URL_IMAGENS+value;
  }
}
