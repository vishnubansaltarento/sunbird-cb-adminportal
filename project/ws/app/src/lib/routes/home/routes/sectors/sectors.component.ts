import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ConfigurationsService } from '@sunbird-cb/utils'
import _ from 'lodash'

@Component({
  selector: 'ws-app-sectors',
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.scss'],
})
export class SectorsComponent implements OnInit {

  currentUser!: string | null
  tabledata: any = []
  displayLoader = false
  data: any = []

  constructor(
    public dialog: MatDialog,
    private configSvc: ConfigurationsService,
  ) {
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
  }

  ngOnInit() {
    this.tabledata = {
      columns: [
        { displayName: 'Sector', key: 'sector' },
        { displayName: 'Subsector', key: 'subSector' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: 'sector',
      sortState: 'asc',
      needUserMenus: false,
      actionColumnName: 'Actions',
      actions: [{ icon: '', label: 'Action', name: 'DownloadFile', type: 'Standard', disabled: false }],
    }

    // this.data = [
    //   {
    //     sector: "Sector 1",
    //     subSector: "Subsector 1, Subsector 2, Subsector 3, Subsector 4",
    //   },
    //   {
    //     sector: "Sector 909",
    //     subSector: "",
    //   },
    // ]
  }
}
