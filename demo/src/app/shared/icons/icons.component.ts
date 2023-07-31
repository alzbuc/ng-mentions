import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg[nthdIcon]',
  templateUrl: './icons.component.html',
  host: {
    xmlns: 'http://www.w3.org/2000/svg',
    '[attr.viewBox]': '"0 0 "+width+" "+height',
    '[attr.width]': 'width',
    '[attr.height]': 'height',
  },
})
export class NthdIcons {
  @Input() nthdIcon: string;
  @Input() width = '24';
  @Input() height = '24';
}
