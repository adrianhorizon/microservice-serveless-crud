import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { StorekeeperService } from 'app/services/grability/storekeeper.service';
import { NotificationService } from 'app/services/utils/notification.service';
import { ErrorUtils } from 'app/utils/ErrorUtils';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

@Component({
    selector: 'restrictions-center-modal-delete',
    templateUrl: './restrictions-center-modal-delete.component.html',
    styleUrls: ['./restrictions-center-modal-delete.component.scss']
})
export class ResctrictionsCenterModalDeleteComponent {

    public translateParams: any;

    constructor(
        private storekeeperService: StorekeeperService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ResctrictionsCenterModalDeleteComponent>,
        @Inject(MAT_DIALOG_DATA) public deleteRestriction: any) {
        this.translateParams = {
            id_restriction: this.deleteRestriction,
        };
    }

    confirmDelete(id) {
        this.storekeeperService.deleteRestriction(id)
            .pipe(
                take(1),
            ).subscribe(() => {
                this.notificationService.success(this.translateService.instant('TOASTS.ACTION_SUCCESS'));
                this.dialogRef.close();
            }, error => {
                this.notificationService.error(ErrorUtils.handleError(error, 'deleteRestriction'), true);
                this.dialogRef.close();
            });
    }
}
