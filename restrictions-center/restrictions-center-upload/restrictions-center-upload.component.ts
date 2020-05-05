import { Component, Inject, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { StorekeeperService } from 'app/services/grability/storekeeper.service';
import { NotificationService } from 'app/services/utils/notification.service';
import { ErrorUtils } from 'app/utils/ErrorUtils';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'restrictions-center-upload',
    templateUrl: './restrictions-center-upload.component.html',
    styleUrls: ['./restrictions-center-upload.component.scss']
})
export class ResctrictionsCenterUploadComponent {

    @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef;

    public chooseLabel = 'Choose';
    public deleteButtonLabel: string;
    public deleteButtonIcon = 'close';
    public inputFileName: string;
    public files: File[] = [];
    public selectFile: number = 0;
    public resctrictionForm: FormGroup;
    public errorMessage = this.translate.instant(`STOREKEEPER-CRM.TRAINING_COURSE.ERROR_MESSAGE`);
    public errors = new FormControl('', [Validators.required, Validators.email]);
    public title: string = this.translate.instant('STOREKEEPER-CRM.RESTRICTIONS_CENTER.MODAL.SELECT_FILE');
    public initForm: number = 1;
    public items: Array<any> = [
        { value: this.title, key: 1 }
    ];

    constructor(
        private storekeeperService: StorekeeperService,
        private notificationService: NotificationService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ResctrictionsCenterUploadComponent>,
        private translate: TranslateService,
        private resctrictionFormReactive: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public resctrictionDetails: any) { }

    somethingChanged(value: number) {
        switch (value) {
            case this.initForm:
                this.onFormResctriction();
                break;
        }
    }

    onFileSelected(event: any) {
        return this.files.push(event.target.files[0]);
    }

    onFormResctriction() {
        this.resctrictionForm = this.resctrictionFormReactive.group({
            request_by: ['', Validators.required],
            restriction_id: ['', Validators.required],
            file: ['', Validators.required]
        });
    }

    removeFile(file: any) {
        let splice;
        if (this.files && -1 !== (splice = this.files.indexOf(file))) {
            this.files.splice(splice, 1);
            this.clearInputElement();
        }
    }

    clearInputElement() {
        this.fileUpload.nativeElement.remove();
    }

    uploadRestriction() {
        this.storekeeperService.createSegmentCsv(this.files, this.resctrictionForm.value)
            .subscribe(() => {
                this.notificationService.success(this.translate.instant('TOASTS.ACTION_SUCCESS'));
                setTimeout(() => this.dialogRef.close());
            }, error => {
                this.notificationService.error(ErrorUtils.handleError(error, 'createSegmentCsv'), true);
            });
    }
}
