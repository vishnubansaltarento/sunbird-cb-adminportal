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

    this.data = [
      {
        id: 1,
        sector: "Education",
        subSector: "Montesory, Primary, Secondary, College, Master",
      },
      {
        id: 2,
        sector: "Finance",
        subSector: "Audit, Budget",
      },
      {
        id: 3,
        sector: "Sports",
        subSector: "Hockey, Cricket",
      }
    ]

  }
}
