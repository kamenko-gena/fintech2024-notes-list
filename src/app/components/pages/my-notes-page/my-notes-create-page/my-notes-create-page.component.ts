import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiAlertModule, TuiDialogModule, TuiRootModule } from '@taiga-ui/core';
import { CreateNoteFormComponent } from 'src/app/components/create-note-form/create-note-form.component';

@Component({
    selector: 'app-my-notes-create-page',
    standalone: true,
    imports: [
        CommonModule,
        TuiRootModule,
        TuiDialogModule,
        TuiAlertModule,
        CreateNoteFormComponent,
    ],
    templateUrl: './my-notes-create-page.component.html',
    styleUrl: './my-notes-create-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyNotesCreatePageComponent {}