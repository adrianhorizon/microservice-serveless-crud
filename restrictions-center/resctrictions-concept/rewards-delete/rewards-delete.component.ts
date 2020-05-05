import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { StorekeeperService } from 'app/services/grability/storekeeper.service';
import { NotificationService } from 'app/services/utils/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorUtils } from 'app/utils/ErrorUtils';
import { LocalStorage } from 'app/utils/LocalStorage';

@Component({
    selector: 'rewards-delete',
    templateUrl: './rewards-delete.component.html',
    styleUrls: ['./rewards-delete.component.scss']
})
export class RewardsDeleteCenterComponent {

    public translateParams: any;

    constructor(
        private storekeeperService: StorekeeperService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<RewardsDeleteCenterComponent>,
        @Inject(MAT_DIALOG_DATA) public rewardDelete: any) {
        this.translateParams = {
            id_restriction: this.rewardDelete,
        };
    }

    deleteReward(rewardDelete: number) {
        const body = {
            id: rewardDelete,
            deleted_by: LocalStorage.getObject('user').email
        };

        this.storekeeperService.deleteRewardsDocument(body)
            .subscribe(() => {
                this.notificationService.success(this.translateService.instant('TOASTS.ACTION_SUCCESS'));
                this.dialogRef.close(true);
            }, error => {
                this.notificationService.error(ErrorUtils.handleError(error, 'deleteRewardsDocument'), true);
            });
    }
}
