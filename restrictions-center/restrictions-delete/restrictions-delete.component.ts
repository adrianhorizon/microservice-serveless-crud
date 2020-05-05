import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { StorekeeperService } from 'app/services/grability/storekeeper.service';
import { NotificationService } from 'app/services/utils/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorUtils } from 'app/utils/ErrorUtils';

@Component({
    selector: 'restrictions-delete',
    templateUrl: './restrictions-delete.component.html',
    styleUrls: ['./restrictions-delete.component.scss']
})
export class ResctrictionsDeleteCenterComponent {

    public fileInfo: string = this.translateService.instant('BUTTON.NAME_ARCHIVE_CSV');
    public uploadCsv: boolean = true;
    public fileDelete: any;
    public deleteTitle: string = 'deleteFile';

    constructor(
        private storekeeperService: StorekeeperService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ResctrictionsDeleteCenterComponent>,
        @Inject(MAT_DIALOG_DATA)
        public resctrictionDelete: any) {
    }

    onFileSelect(input: HTMLInputElement) {
        const file = input.files;
        this.fileDelete = file;
        this.uploadCsv = false;
        this.fileInfo = file[0].name;
    }

    deleteRestriction() {

        const body = {
            request_by: this.deleteTitle
        };

        this.storekeeperService.createSegmentCsv(this.fileDelete, body)
            .subscribe(() => {
                this.notificationService.success(this.translateService.instant('TOASTS.ACTION_SUCCESS'));
                setTimeout(() => this.dialogRef.close());
            }, error => {
                this.notificationService.error(ErrorUtils.handleError(error, 'createSegmentCsv'), true);
            });
    }
}
