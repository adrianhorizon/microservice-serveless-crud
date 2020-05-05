import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorUtils } from 'app/utils/ErrorUtils';
import { StorekeeperService } from 'app/services/grability/storekeeper.service';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { NotificationService } from 'app/services/utils/notification.service';
import { TABLE_REWARDS_CENTER } from 'app/utils/constants/restrictions';
import { take, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { RewardsDeleteCenterComponent } from '../rewards-delete/rewards-delete.component';
import { RewardsModalComponent } from '../rewards-modal/rewards-modal.component';

@Component({
    selector: 'sk-rewards-center-information',
    templateUrl: './rewards-center-information.component.html',
    styleUrls: ['./rewards-center-information.component.scss']
})
export class RewardsCenterInformationComponent implements OnInit {

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    public rewardsData: MatTableDataSource<any>;
    public displayedColumns: string[] = TABLE_REWARDS_CENTER;
    public totalSize: number = 0;
    public currentPage: number = 1;
    public pageSize: number = 10;

    constructor(
        private storekeeperService: StorekeeperService,
        private notificationService: NotificationService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.allRewards();
    }

    /*
    createRewardsDocument(body: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrlExternal}/microservices/restrictions/rewards`, body);
    }

    updateRewardsDocument(body: any): Observable<any> {
        return this.httpClient.put(`${this.baseUrlExternal}/microservices/restrictions/rewards`, body);
    }
    */

    allRewards() {
         this.storekeeperService.allRewardsDocument()
            .pipe(
                take(1),
                map(({ data }) => {
                    this.rewardsData = new MatTableDataSource(data.sort((array, order) => order.id - array.id));
                    this.rewardsData.paginator = this.paginator;
                    this.rewardsData.sort = this.sort;
                    this.totalSize = data.length;
                }),
                catchError((error) => {
                    this.notificationService.error(ErrorUtils.handleError(error, 'allRewardsDocument'), true);
                    return of({ error: true });
                }),
            ).subscribe();
    }

    rewardModal(data: any) {
        const createReward = this.dialog.open(RewardsModalComponent, {
            data,
            width: '500px',
        });

        createReward.afterClosed().subscribe(result => {
            if (result) {
                this.allRewards()
            }
        });
    }

    rewardDelete(id: any) {
        const rewardDeleteDialog = this.dialog.open(RewardsDeleteCenterComponent, {
            data: id,
            width: '500px',
        });

        rewardDeleteDialog.afterClosed().subscribe(result => {
            if (result) {
                this.allRewards()
            }
        });
    }

    applyFilter(filterValue: string) {
        this.rewardsData.filter = filterValue.trim().toLowerCase();

        if (this.rewardsData.paginator) {
            this.rewardsData.paginator.firstPage();
        }
    }
}
