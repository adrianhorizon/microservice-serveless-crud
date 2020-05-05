import { OnInit, Component, Inject } from '@angular/core';
import { StorekeeperService } from 'app/services/grability/storekeeper.service';
import { NotificationService } from 'app/services/utils/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { ErrorUtils } from 'app/utils/ErrorUtils';
import { LocalStorage } from 'app/utils/LocalStorage';

@Component({
    selector: 'sk-rewards-modal',
    templateUrl: './rewards-modal.component.html',
    styleUrls: ['./rewards-modal.component.scss']
})

export class RewardsModalComponent implements OnInit {

    public errorMessage = this.translateService.instant(`REQUIRED_INPUT`);
    public errors = new FormControl('', [Validators.required, Validators.email]);
    public rewardForm: FormGroup;

    constructor(
        private storekeeperService: StorekeeperService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private rewardFormReactive: FormBuilder,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<RewardsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public rewardData: any) { console.log(rewardData) }

    ngOnInit() {

    }

    onForm() {
        this.rewardForm = this.rewardFormReactive.group({
            description: ['', Validators.required],
        });
    }

    onSubmit(rewardFormValue: FormGroup) {
        const restrictionValue = { ...rewardFormValue.value };
        const email = LocalStorage.getObject('user').email;
        let body = {}

        if (this.rewardData) {
            body = {
                id: this.rewardData.id,
                description: restrictionValue.description,
                updated_by: email,
            }

            this.editRestriction(body);
        } else {
            body = {
                description: restrictionValue.description,
                created_by: email,
            }

            this.newRestriction(body);
        }
    }

    newRestriction(rewardFormValue: any) {
        this.storekeeperService.createRewardsDocument(rewardFormValue)
            .subscribe(data => {
                this.notificationService.success(this.translateService.instant('TOASTS.ACTION_SUCCESS'));
                this.dialogRef.close(true);
            }, error => {
                this.notificationService.error(ErrorUtils.handleError(error, 'createRestrictions'), true);
            });
    }

    editRestriction(rewardFormValue: any) {
        this.storekeeperService.updateRewardsDocument(rewardFormValue)
            .subscribe(() => {
                this.notificationService.success(this.translateService.instant('TOASTS.ACTION_SUCCESS'));
                this.dialogRef.close(true);
            }, error => {
                this.notificationService.error(ErrorUtils.handleError(error, 'editRestrictions'), true);
            });
    }

}