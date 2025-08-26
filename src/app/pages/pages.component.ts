import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <!-- <app-layout> -->
      <router-outlet />
    <!-- </app-layout> -->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagesComponent {}
