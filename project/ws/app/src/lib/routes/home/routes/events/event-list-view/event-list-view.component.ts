import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild,
  AfterViewInit, OnChanges, SimpleChanges, Inject, ChangeDetectorRef, AfterViewChecked,
} from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import * as _ from 'lodash'
import { ITableData, IColums, IAction } from '../interfaces/interfaces'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { EventThumbnailComponent } from '../event-thumbnail/event-thumbnail.component'
import { EventService } from '@sunbird-cb/utils'
import { NsContent } from '@sunbird-cb/collection'
import { TelemetryEvents } from '../model/telemetry.event.model'
import * as moment from 'moment'
import { environment } from '../../../../../../../../../../src/environments/environment'

export interface IContentShareData {
  content: NsContent.IContent
}

@Component({
  selector: 'ws-event-list-view',
  templateUrl: './event-list-view.component.html',
  styleUrls: ['./event-list-view.component.scss'],
})
export class EventListViewComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked {

  @Input() tableData!: ITableData | undefined
  @Input() data?: []
  @Input() isUpload?: boolean
  @Input() isCreate?: boolean
  @Input() currentFilter?: ''

  @Input() columns?: IColums[]
  @Input() needCheckBox?: Boolean
  @Input() needHash?: boolean
  @Input() actions?: IAction[]
  @Output() clicked?: EventEmitter<any>
  @Output() actionsClick?: EventEmitter<any>
  @Output() eOnRowClick = new EventEmitter<any>()
  @Output() eOnCreateClick = new EventEmitter<any>()

  bodyHeight = document.body.clientHeight - 125
  displayedColumns: any = []
  dataSource!: any
  widgetData: any
  length!: number
  pageSize = 20
  pageSizeOptions = [20, 30, 40]
  finalImg: any
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }
  // @ViewChild(MatSort, { static: true }) sort?: MatSort
  selection = new SelectionModel<any>(true, [])
  dialogRef: any
  configSvc: any
  searchColumn!: string

  constructor(
    private router: Router,
    private matDialog: MatDialog,
    private events: EventService,
    // private telemetrySvc: TelemetryService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public content: IContentShareData,
  ) {
    this.configSvc = this.route.parent && this.route.parent.snapshot.data.configService
    this.dataSource = new MatTableDataSource<any>()
    this.actionsClick = new EventEmitter()
    this.clicked = new EventEmitter()
    this.dataSource.paginator = this.paginator
  }

  ngOnInit() {
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
    this.dataSource.data = this.data
  }

  ngOnChanges(data: SimpleChanges) {
    this.dataSource.data = _.get(data, 'data.currentValue')
    this.length = this.dataSource.data.length
    this.paginator.firstPage()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.filterPredicate = function (data: any, filter: string): boolean {
      return data.eventName.toLowerCase().includes(filter)
    }
    this.dataSource.sortingDataAccessor = (item: any, property: any) => {
      switch (property) {
        case 'eventStartDate': {
          return this.customDateFormat(item.startDate, item.startTime)
        }
        case 'eventCreatedOn': {
          const newDate = this.allEventDateFormat(item.createdOn)
          return newDate
        }
        case 'eventDuration': {
          return item.duration
        }
        case 'eventjoined': {
          return item.eventjoined
        }
        default: {
          return item[property]
        }
      }
    }
  }

  customDateFormat(date: string, time: string) {
    const fTime = time.split('+')
    const datetimetest = moment(`${date}T${fTime[0]}`).toISOString()
    const format = 'DD MMM YYYY HH:mm'
    const readableDateMonth = moment(datetimetest).format(format)
    const finalDateTimeValue = `${readableDateMonth}`
    return new Date(finalDateTimeValue)
  }

  allEventDateFormat(datetime: any) {
    const date = new Date(datetime).getDate()
    const year = new Date(datetime).getFullYear()
    const month = new Date(datetime).getMonth()
    const hours = new Date(datetime).getHours()
    const minutes = new Date(datetime).getMinutes()
    const seconds = new Date(datetime).getSeconds()
    const formatedDate = new Date(year, month, date, hours, minutes, seconds, 0)
    const format = 'DD MMM YYYY HH:mm'
    const readableDateMonth = moment(formatedDate).format(format)
    const finalDateTimeValue = `${readableDateMonth}`
    return new Date(finalDateTimeValue)
  }

  ngAfterViewChecked() {
    this.cd.detectChanges()
  }

  applyFilter(filterValue: any) {
    if (filterValue) {
      let fValue = filterValue.trim()
      fValue = filterValue.toLowerCase()
      this.dataSource.filter = fValue
    } else {
      this.dataSource.filter = ''
    }
  }

  buttonClick(action: string, row: any) {
    if (this.tableData) {
      const isDisabled = _.get(_.find(this.tableData.actions, ac => ac.name === action), 'disabled') || false
      if (!isDisabled && this.actionsClick) {
        this.actionsClick.emit({ action, row })
      }
    }
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
      if (this.tableData.needUserMenus) {
        columns.push('Menu')
      }
      return columns
    }
    return ''
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  filterList(list: any[], key: string) {
    return list.map(lst => lst[key])
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: any) => this.selection.select(row))
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`
  }

  onRowClick(e: any) {
    this.eOnRowClick.emit(e)
  }

  onCreateClick() {
    this.router.navigate([`/app/home/events/create-event`])
    // this.telemetrySvc.impression()
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.BTN_CONTENT,
      },
      {}
    )
  }

  showImageDialog(img: any) {
    if (img.includes('Events_default')) {
      const mainUrl = img && img.split('/content').pop() || ''
      const finalURL = `${environment.contentHost}${mainUrl}`
      this.finalImg = img ? finalURL : ''

    } else {
      const mainUrl = img && img.split('/content').pop() || ''
      const finalURL = `${environment.contentHost}/${environment.contentBucket}/content${mainUrl}`
      this.finalImg = img ? finalURL : ''
    }

    this.dialogRef = this.matDialog.open(EventThumbnailComponent, {
      width: '800px',
      data: this.finalImg,
    })
  }

}
