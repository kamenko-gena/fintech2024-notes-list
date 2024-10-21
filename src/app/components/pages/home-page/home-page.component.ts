import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
