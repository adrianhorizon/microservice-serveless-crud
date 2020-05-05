import { NgModule } from '@angular/core';
import { ApplicationModule } from 'app/shared/application/application.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DirectivesModule } from 'app/shared/directives/directives.module';
import { StorekeeperService } from 'app/services/grability/storekeeper.service';
import { RestrictionsRoutingModule } from './restrictions-center.routing.module';
import { CountriesGrabService } from 'app/services/grability/countries-grab.service';
import { NotificationsService } from 'app/services/firebase/chat/notifications.service';
import { LocationsService } from 'app/services/external/locations.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ResctrictionsCenterViewComponent } from './restrictions-center.component';
import { ResctrictionsCenterModalComponent } from './restrictions-center-modal/restrictions-center-modal.component';
import { ResctrictionsCenterInformationComponent } from './restrictions-center-information/restrictions-center-information.component';
import { ResctrictionsCenterDetailsComponent } from './restrictions-center-details/restrictions-center-details.component';
import { ResctrictionsCenterUploadComponent } from './restrictions-center-upload/restrictions-center-upload.component';
import { ResctrictionsCenterStatusComponent } from './restrictions-center-status/restrictions-center-status.component';
import { ResctrictionsCenterModalDeleteComponent } from './restrictions-center-modal-delete/restrictions-center-modal-delete.component';
import { ResctrictionsDeleteCenterComponent } from './restrictions-delete/restrictions-delete.component';
import { RewardsCenterInformationComponent } from './resctrictions-concept/rewards-information/rewards-center-information.component';
import { RewardsDeleteCenterComponent } from './resctrictions-concept/rewards-delete/rewards-delete.component';
import { RewardsModalComponent } from './resctrictions-concept/rewards-modal/rewards-modal.component';

@NgModule({
    imports: [
        CommonModule,
        RestrictionsRoutingModule,
        ReactiveFormsModule,
        ApplicationModule,
        DirectivesModule,
        FormsModule,
        NgxMaterialTimepickerModule,
    ],
    declarations: [
        ResctrictionsCenterViewComponent,
        ResctrictionsCenterModalComponent,
        ResctrictionsCenterInformationComponent,
        ResctrictionsCenterDetailsComponent,
        ResctrictionsCenterUploadComponent,
        ResctrictionsCenterStatusComponent,
        ResctrictionsCenterModalDeleteComponent,
        ResctrictionsDeleteCenterComponent,
        RewardsCenterInformationComponent,
        RewardsDeleteCenterComponent,
        RewardsModalComponent,
    ],
    providers: [
        StorekeeperService,
        CountriesGrabService,
        NotificationsService,
        LocationsService,
    ],
    entryComponents: [
        ResctrictionsCenterModalComponent,
        ResctrictionsCenterDetailsComponent,
        ResctrictionsCenterUploadComponent,
        ResctrictionsCenterStatusComponent,
        ResctrictionsCenterModalDeleteComponent,
        ResctrictionsDeleteCenterComponent,
        RewardsDeleteCenterComponent,
        RewardsModalComponent,
    ]
})
export class RestrictionsCenterStorekeeperModule { }