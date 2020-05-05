import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { StorekeeperService } from 'app/services/grability/storekeeper.service';
import { NotificationService } from 'app/services/utils/notification.service';
import { ErrorUtils } from 'app/utils/ErrorUtils';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { TABLE_WEEK_DAYS } from 'app/utils/constants/restrictions';

@Component({
    selector: 'restrictions-center-modal',
    templateUrl: './restrictions-center-modal.component.html',
    styleUrls: ['./restrictions-center-modal.component.scss']
})
export class ResctrictionsCenterModalComponent implements OnInit {

    public errorMessage = this.translateService.instant(`STOREKEEPER-CRM.TRAINING_COURSE.ERROR_MESSAGE`);
    public errors = new FormControl('', [Validators.required, Validators.email]);
    public restrictionForm: FormGroup;
    public editData: any;
    public readonly datePlaceholder: string = '00:00';
    public readonly weekDays = TABLE_WEEK_DAYS;

    constructor(
        private storekeeperService: StorekeeperService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ResctrictionsCenterModalComponent>,
        private restrictionFormReactive: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public restrictionUser: any) { }

    ngOnInit() {
        this.onForm();
        Object.keys(this.weekDays).map(key => this.weekDays[key].status = true);

        if (this.restrictionUser.data) {
            this.editData = Object.keys(this.restrictionUser.edit.restriction_schedules).map(key => {
                const dataEdit = this.restrictionUser.edit.restriction_schedules[key];
                const control = <FormArray>this.restrictionForm.controls['restriction_schedules'];
                control.push(this.formRestriction(dataEdit.day_of_the_week, dataEdit.start_hour, dataEdit.end_hour));
                return dataEdit.day_of_the_week.toUpperCase();
            });

            Object.keys(this.weekDays).map(key => this.weekDays[key].status = !this.editData.includes(this.weekDays[key].text));
        }
    }

    onForm() {
        this.restrictionForm = this.restrictionFormReactive.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            active: false,
            restriction_schedules: this.restrictionFormReactive.array([])
        });
    }

    formRestriction(day: string, created?: string, updated?: string) {
        return this.restrictionFormReactive.group({
            day: [day],
            weeks_days: this.restrictionFormReactive.array([
                this.formWeekDays(day, created, updated)
            ])
        });
    }

    formWeekDays(value: string, created?: string, updated?: string) {
        return this.restrictionFormReactive.group({
            day_of_the_week: value,
            start_hour: [created || '', Validators.required],
            end_hour: [updated || '', Validators.required],
        });
    }

    enableDisableRule(value: any, status: boolean) {
        this.weekDays[value].status = !status;

        if (this.weekDays[value].status) {
            this.removeItem(this.weekDays[value].key, true);
        } else {
            const control = <FormArray>this.restrictionForm.controls['restriction_schedules'];
            control.push(this.formRestriction(this.weekDays[value].key));
        }
    }

    addCreds(value: any, week: any) {
        const control = (<FormArray>this.restrictionForm.controls['restriction_schedules']).at(value).get('weeks_days') as FormArray;
        control.push(this.formWeekDays(week.value.day));
    }

    removeItem(value: any, optional?: boolean) {
        if (optional) {
            const controls = (<FormArray>this.restrictionForm.controls['restriction_schedules']) as FormArray;
            const findData = controls.value.findIndex(({ day }) => day === value);

            return controls.removeAt(findData);
        } else {
            const control = (<FormArray>this.restrictionForm.controls['restriction_schedules']).at(value).get('weeks_days') as FormArray;

            return control.removeAt(control.length - 1);
        }
    }

    onSubmit(restrictionForm: FormGroup) {
        const restrictionValue = { ...restrictionForm.value };
        const schedules = this.reduceData(restrictionValue);

        const body = {
            name: restrictionValue.name,
            description: restrictionValue.description,
            active: restrictionValue.active,
            restriction_schedules: schedules
        };

        if (this.restrictionUser.data) {
            body['id'] = this.restrictionUser.data.id;
            this.editRestriction(body);
        } else {
            this.newRestriction(body);
        }
    }

    reduceData(value: any) {
        return value.restriction_schedules.reduce((count, newArray) =>
            Array.isArray(newArray) ? count.concat(this.reduceData(newArray['weeks_days'])) : count.concat(newArray['weeks_days']), []);
    }

    newRestriction(restrictionForm: any) {
        this.storekeeperService.createRestrictions(restrictionForm)
            .subscribe(data => {
                this.notificationService.success(this.translateService.instant('TOASTS.ACTION_SUCCESS'));
                this.dialogRef.close(data);
            }, error => {
                this.notificationService.error(ErrorUtils.handleError(error, 'createRestrictions'), true);
            });
    }

    editRestriction(restrictionForm: any) {
        this.storekeeperService.editRestrictions(restrictionForm)
            .subscribe(() => {
                this.notificationService.success(this.translateService.instant('TOASTS.ACTION_SUCCESS'));
                setTimeout(() => this.dialogRef.close());
            }, error => {
                this.notificationService.error(ErrorUtils.handleError(error, 'editRestrictions'), true);
            });
    }
}
