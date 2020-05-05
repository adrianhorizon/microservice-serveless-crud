import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { StorekeeperService } from 'app/services/grability/storekeeper.service';
import { NotificationService } from 'app/services/utils/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorUtils } from 'app/utils/ErrorUtils';
import { take } from 'rxjs/operators';

@Component({
    selector: 'restrictions-center-status',
    templateUrl: './restrictions-center-status.component.html',
    styleUrls: ['./restrictions-center-status.component.scss']
})
export class ResctrictionsCenterStatusComponent {

    constructor(
        private storekeeperService: StorekeeperService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ResctrictionsCenterStatusComponent>,
        @Inject(MAT_DIALOG_DATA) public resctrictionDetails: any) { }

    editRestriction(formBody: any) {
        const dataEdit = !!formBody.active;

        const body = {
            id: formBody.id,
            name: formBody.name,
            description: formBody.description,
            active: !dataEdit,
            created_at: formBody.created_at,
            updated_at: formBody.updated_at,
            restriction_schedules: formBody.restriction_schedules
        };
        this.storekeeperService.editRestrictions(body)
            .pipe(
                take(1),
            ).subscribe(data => {
                this.notificationService.success(this.translateService.instant('TOASTS.ACTION_SUCCESS'));
                this.dialogRef.close(data);
            }, error => {
                this.notificationService.error(ErrorUtils.handleError(error, 'editRestrictions'), true);
            });
    }
}
