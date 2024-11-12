import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
    OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    TUI_VALIDATION_ERRORS,
    TuiCheckboxLabeledModule,
    TuiDataListWrapperModule,
    TuiFieldErrorPipeModule,
    TuiInputModule,
    TuiRadioBlockModule,
    TuiSelectModule,
    TuiTextareaModule,
} from '@taiga-ui/kit';
import {
    TuiAlertModule,
    TuiAlertService,
    TuiButtonModule,
    TuiErrorModule,
    TuiGroupModule,
    TuiLinkModule,
} from '@taiga-ui/core';
import { tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk';
import { SolutionDescriptValidatorDirective } from 'src/app/directives/solution-descript-validator/solution-descript-validator.directive';
import { NoteInterface } from 'src/app/interfaces/note-interface';
import { Router, RouterLink } from '@angular/router';
import { FirebaseStorageService } from 'src/app/services/firebase-storage-service/firebase-storage.service';
import { take } from 'rxjs';

const NOTE_SECTIONS = [
    'Пожарная автоматика',
    'Охранная сигнализация',
    'Управление доступом',
    'Видеонаблюдение',
];
const CURRENT_DATE = new Date();

type NoteSections = typeof NOTE_SECTIONS;
type Section = NoteSections[number];

@Component({
    selector: 'app-create-note-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TuiRadioBlockModule,
        TuiButtonModule,
        TuiGroupModule,
        TuiSelectModule,
        TuiDataListWrapperModule,
        TuiCheckboxLabeledModule,
        TuiTextareaModule,
        TuiFieldErrorPipeModule,
        TuiErrorModule,
        TuiAlertModule,
        TuiInputModule,
        SolutionDescriptValidatorDirective,
        RouterLink,
        TuiLinkModule,
    ],
    templateUrl: './create-note-form.component.html',
    styleUrl: './create-note-form.component.less',
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: {
                required: 'Обязательное заполнение!',
                maxlength: ({ requiredLength }: { requiredLength: string }) =>
                    `Максимальная длинна символов — ${requiredLength}`,
            },
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNoteFormComponent implements OnInit {
    private readonly alerts: TuiAlertService = inject(TuiAlertService);
    private readonly firebaseStorageService = inject(FirebaseStorageService);
    private readonly router = inject(Router);

    readonly currentDate = CURRENT_DATE;
    readonly noteSection = NOTE_SECTIONS;
    @Input() note: NoteInterface | null = null;

    readonly noteFormGroup = new FormGroup({
        section: new FormControl<Section>('', [Validators.required]),
        equipName: new FormControl<string>('', {
            validators: [Validators.required, Validators.maxLength(50)],
        }),
        faultDescript: new FormControl<string>('', {
            validators: [Validators.required, Validators.maxLength(500)],
        }),
        isCompleted: new FormControl<boolean>(false),
        solutionDescript: new FormControl<string | null>(null),
    });

    ngOnInit(): void {
        if (this.note) this.noteFormGroup.patchValue(this.note);
    }

    submitForm() {
        if (this.noteFormGroup.invalid) {
            tuiMarkControlAsTouchedAndValidate(this.noteFormGroup);
            return;
        }

        this.alerts
            .open('Заметка создана!', {
                label: 'Готово!',
                status: 'success',
            })
            .pipe(take(1))
            .subscribe();
        this.firebaseStorageService
            .addNoteToStorage({
                ...this.noteFormGroup.value,
                date: [
                    this.currentDate.getDate(),
                    this.currentDate.getMonth() + 1,
                    this.currentDate.getFullYear(),
                ],
            } as NoteInterface)
            .subscribe();

        this.noteFormGroup.reset();
    }

    updateForm() {
        if (!this.note || this.noteFormGroup.invalid) {
            return;
        }

        this.firebaseStorageService
            .updateNote(this.note.id, this.noteFormGroup.value)
            .subscribe({
                complete: () => {
                    this.alerts
                        .open('Заметка изменена', {
                            label: 'Готово!',
                            status: 'info',
                        })
                        .pipe(take(1))
                        .subscribe();
                    this.router.navigateByUrl('/my-notes');
                },
            });
    }
}
