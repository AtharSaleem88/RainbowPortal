import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoBoxComponent } from '@shared/components';

@Component({
  selector: 'app-lock-screen',
  standalone: true,
  imports: [LogoBoxComponent, RouterLink],
  templateUrl: './lock-screen.component.html',
  styles: ``,
})
export class LockScreenComponent {}

export { LockScreenComponent as LockScreen };
