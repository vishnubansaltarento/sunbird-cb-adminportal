import { Router } from '@angular/router'
import {
  Component, EventEmitter, Input, OnInit, Output, ViewChild,
} from '@angular/core'
import * as _ from 'lodash'
import { IAction, ITableData } from '../../events/interfaces/interfaces'
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material'

@Component({
  selector: 'ws-sector-list-view',
  templateUrl: './sector-list-view.component.html',
  styleUrls: ['./sector-list-view.component.scss'],
})
export class SectorListViewComponent implements OnInit {
  @Input() tableData!: ITableData | undefined
  @Input() data?: []
  @Input() isCreate?: boolean
  @Output() actionsClick?: EventEmitter<any>
  @Input() actions?: IAction[]
  bodyHeight = document.body.clientHeight - 125
  displayedColumns: any = []
  dataSource!: any
  length!: number
  pageSize = 20
  pageSizeOptions = [20, 30, 40]
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }

  constructor(
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<any>()
    this.actionsClick = new EventEmitter()
    this.dataSource.paginator = this.paginator
  }

  getFinalColumns() {
    if (this.tableData !== undefined) {
      const columns = _.map(this.tableData.columns, c => c.key)
      if (this.tableData.needCheckBox) {
        columns.splice(0, 0, 'select')
      }
      if (this.tableData.needHash) {
        columns.splice(0, 0, 'SR')
      }
      if (this.tableData.actions && this.tableData.actions.length > 0) {
        columns.push('Actions')
      }
      if (this.tableData.actions && this.tableData.actions.length > 0) {
        // columns.push('Menu')
      }
      return columns
    }
    return ''
  }


  ngOnInit() {
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
    this.dataSource.data = this.data
  }

  applyFilter(event: any) {
    console.log("event ", event)
  }

  onCreateClick() {
    this.router.navigateByUrl('/app/home/sectors/new')
  }






}
