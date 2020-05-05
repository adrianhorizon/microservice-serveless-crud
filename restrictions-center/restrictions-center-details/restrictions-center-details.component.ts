import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'restrictions-center-details',
    templateUrl: './restrictions-center-details.component.html',
    styleUrls: ['./restrictions-center-details.component.scss']
})
export class ResctrictionsCenterDetailsComponent {

    public titleTranslate: string = 'STOREKEEPER-CRM.RESTRICTIONS_CENTER.TABLE';
    public title: string = this.translate.instant(`${this.titleTranslate}.RESTRICTED_DAYS`);
    public readonly items: Array<{}> = [
        { title: `${this.titleTranslate}.NAME`, value: this.resctrictionDetails.name },
        {
            value: this.title, title: '', key: [
                { value: this.resctrictionDetails.start_hour, subTitle: this.resctrictionDetails.day_of_the_week },
                { value: this.resctrictionDetails.end_hour, subTitle: this.resctrictionDetails.day_of_the_week },
            ]
        },
        { title: `${this.titleTranslate}.CREATED`, value: this.resctrictionDetails.created_at },
        { title: `${this.titleTranslate}.STATUS`, value: this.resctrictionDetails.active },
        { title: `${this.titleTranslate}.UPDATE`, value: this.resctrictionDetails.updated_at },
    ];

    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ResctrictionsCenterDetailsComponent>,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) public resctrictionDetails: any) { }
}
