import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResctrictionsCenterViewComponent } from './restrictions-center.component';

const routes: Routes = [
    {
        path: '', component: ResctrictionsCenterViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RestrictionsRoutingModule { }
