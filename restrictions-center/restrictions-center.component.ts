import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TABS_RESTRICTIONS_CENTER } from 'app/utils/constants/restrictions';

@Component({
    selector: 'sk-restrictions-center',
    templateUrl: './restrictions-center.component.html',
    styleUrls: ['./restrictions-center.component.scss']
})
export class ResctrictionsCenterViewComponent implements OnInit {
    @Output() actualTab: EventEmitter<any> = new EventEmitter<any>();

    public actualTabName: string = '';
    public currentTab: string;
    public readonly TABS = TABS_RESTRICTIONS_CENTER;

    ngOnInit() {
        this.selectTab(this.TABS.RESTRICTIONS_CENTER);
    }

    selectTab(actualTab) {
        this.actualTabName = actualTab.TITLE;
        this.currentTab = actualTab.KEY;
    }
}
