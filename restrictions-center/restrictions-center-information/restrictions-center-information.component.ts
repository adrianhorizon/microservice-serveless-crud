import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorUtils } from 'app/utils/ErrorUtils';
import { StorekeeperService } from 'app/services/grability/storekeeper.service';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { NotificationService } from 'app/services/utils/notification.service';
import { ResctrictionsCenterModalComponent } from '../restrictions-center-modal/restrictions-center-modal.component';
import { ResctrictionsCenterDetailsComponent } from '../restrictions-center-details/restrictions-center-details.component';
import { ResctrictionsCenterUploadComponent } from '../restrictions-center-upload/restrictions-center-upload.component';
import { TABLE_RESTRICTIONS_CENTER, TABLE_FILTER_RESTRICTIONS, ALL_RESTRICTIONS, ACTIVE_RESCTRICTIONS } from 'app/utils/constants/restrictions';
import { ResctrictionsCenterStatusComponent } from '../restrictions-center-status/restrictions-center-status.component';
import { ResctrictionsCenterModalDeleteComponent } from '../restrictions-center-modal-delete/restrictions-center-modal-delete.component';
import { take } from 'rxjs/operators';
import { ResctrictionsDeleteCenterComponent } from '../restrictions-delete/restrictions-delete.component';

@Component({
    selector: 'sk-restrictions-center-information',
    templateUrl: './restrictions-center-information.component.html',
    styleUrls: ['./restrictions-center-information.component.scss']
})
export class ResctrictionsCenterInformationComponent implements OnInit {

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    public restrictionsData: MatTableDataSource<any>;
    public displayedColumns: string[] = TABLE_RESTRICTIONS_CENTER;
    public totalSize: number = 0;
    public currentPage: number = 1;
    public pageSize: number = 10;
    public categoriesDisplay: Array<any> = TABLE_FILTER_RESTRICTIONS;
    public newData: string[] = [];
    public editInformation: any;
    public selected: any;

    constructor(
        private storekeeperService: StorekeeperService,
        private notificationService: NotificationService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.restrictionsAll();
    }

    restrictionsAll() {
        this.storekeeperService.restrictionsAll()
            .pipe(
                take(1),
            ).subscribe(({ data }) => {
                this.editInformation = data;
                const newData = this.reduceData(data);
                const body = this.newDataSubscribe(newData, data);
                const filterDeleteData = body.filter(({ deleted_at }) => !deleted_at);
                this.restrictionsData = new MatTableDataSource(filterDeleteData.sort((array, order) => order.id - array.id));
                this.restrictionsData.paginator = this.paginator;
                this.restrictionsData.sort = this.sort;
                this.totalSize = filterDeleteData.length;
            }, error => this.notificationService.error(ErrorUtils.handleError(error, 'restrictionsAll'), true));
    }

    restrictionsActive() {
        this.storekeeperService.restrictionsActive()
            .pipe(
                take(1),
            ).subscribe(({ data }) => {
                this.editInformation = data;
                this.restrictionsData = new MatTableDataSource(data.sort((array, order) => order.id - array.id));
                this.restrictionsData.paginator = this.paginator;
                this.restrictionsData.sort = this.sort;
                this.totalSize = data.length;
            }, error => this.notificationService.error(ErrorUtils.handleError(error, 'restrictionsActive'), true));
    }

    somethingChanged(value: number) {
        switch (value) {
            case ALL_RESTRICTIONS:
                this.restrictionsAll();
                break;
            case ACTIVE_RESCTRICTIONS:
                this.restrictionsActive();
                break;
        }
    }

    private reduceData(value: any) {
        return value.reduce((count, newArray) =>
            Array.isArray(newArray) ? count.concat(this.reduceData(newArray['restriction_schedules'])) : count.concat(newArray['restriction_schedules']), []);
    }

    private newDataSubscribe(newData: any, data: any) {
        const body = [];
        Object.keys(newData).map(key => {
            Object.keys(data).map(keys => {
                if (newData[key].restriction_id === data[keys].id) {
                    body[key] = this.newBodyRestriction(key, keys, newData, data);
                }
            });
        });

        return body;
    }

    private newBodyRestriction(key: string, keys: string, newData: any, data: any) {
        return {
            name: data[keys].name,
            active: data[keys].active,
            id: newData[key].restriction_id,
            day_of_the_week: newData[key].day_of_the_week,
            start_hour: newData[key].start_hour,
            end_hour: newData[key].end_hour,
            created_at: newData[key].created_at,
            updated_at: newData[key].updated_at,
            deleted_at: data[keys].deleted_at
        };
    }

    addItem(data: any) {
        let editData;
        if (data) {
            editData = this.editInformation.find(res => res.id === data.id);
        }

        const dialogRef = this.dialog.open(ResctrictionsCenterModalComponent, {
            data: {
                data,
                edit: editData || []
            },
            width: '1000px'
        });

        dialogRef.afterClosed().subscribe(() => this.restrictionsAll());
    }

    statusRestriction(data: any) {
        let editData;
        if (data) {
            editData = this.editInformation.find(res => res.id === data.id);
        }

        const dialogRef = this.dialog.open(ResctrictionsCenterStatusComponent, {
            data: editData,
            width: '1000px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.restrictionsAll();
            }
        });
    }

    resctrictionsDelete() {
        this.dialog.open(ResctrictionsDeleteCenterComponent, {
            width: '700px'
        });
    }

    uploadFile() {
        const dialogRef = this.dialog.open(ResctrictionsCenterUploadComponent);
        dialogRef.afterClosed().subscribe(() => this.restrictionsAll());
    }

    viewDetails(data: any) {
        this.dialog.open(ResctrictionsCenterDetailsComponent, {
            data: data,
            width: '1000px'
        });
    }

    restrictionDelete(id: any) {
        const dialogRef = this.dialog.open(ResctrictionsCenterModalDeleteComponent, {
            data: id,
            width: '500px',
        });

        dialogRef.afterClosed().subscribe(() => this.restrictionsAll());
    }

    applyFilter(filterValue: string) {
        this.restrictionsData.filter = filterValue.trim().toLowerCase();

        if (this.restrictionsData.paginator) {
            this.restrictionsData.paginator.firstPage();
        }
    }

    cellStyleStatus(value: any) {
        return [false].includes(value) ? 'danger-button' : 'stroke-button';
    }
}
