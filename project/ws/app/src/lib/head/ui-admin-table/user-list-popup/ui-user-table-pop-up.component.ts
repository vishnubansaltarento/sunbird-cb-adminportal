import {
  Component, OnInit, Output, EventEmitter, ViewChild,
  AfterViewInit, OnChanges, SimpleChanges,
} from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import * as _ from 'lodash'
import { ITableData, IColums } from '../interface/interfaces'
import { ProfileV2UtillService } from '../../../routes/home/services/home-utill.service'
import { UsersService } from '../../../routes/home/services/users.service'
import { ActivatedRoute } from '@angular/router'
import { CreateMDOService } from '../../../routes/home/services/create-mdo.services'

interface IUser { fullname: string; email: string, userId: string }

@Component({
  selector: 'ws-widget-ui-user-table-pop-up',
  templateUrl: './ui-user-table-pop-up.component.html',
  styleUrls: ['./ui-user-table-pop-up.component.scss'],
})
export class UIUserTablePopUpComponent implements OnInit, AfterViewInit, OnChanges {
  tableData!: ITableData | undefined
  data!: IUser[] | undefined
  @Output() clicked?: EventEmitter<any>
  @Output() actionsClick?: EventEmitter<any>
  @Output() eOnRowClick = new EventEmitter<any>()
  bodyHeight = document.body.clientHeight - 125
  displayedColumns: IColums[] | undefined
  viewPaginator = false
  dataSource!: any
  widgetData: any
  deparmentId: any
  length!: number
  chkBox = false
  isSearched = false
  pageSize = 20
  pageSizeOptions = [20, 30, 40]
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  @ViewChild(MatSort, { static: true }) sort?: MatSort
  selection = new SelectionModel<any>(true, [])

  constructor(private profileUtilSvc: ProfileV2UtillService,
    // tslint:disable-next-line:align
    private userService: UsersService,
    // tslint:disable-next-line:align
    private activatedRoute: ActivatedRoute,
    // tslint:disable-next-line:align
    private createMDOService2: CreateMDOService) {
    this.dataSource = new MatTableDataSource<any>()
    this.actionsClick = new EventEmitter()
    this.clicked = new EventEmitter()
    this.dataSource.paginator = this.paginator

  }

  ngOnInit() {
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
    this.dataSource.data = []
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.viewPaginator = true
    this.tableData = {
      columns: [
        { displayName: 'Full name', key: 'fullname' },
        { displayName: 'Email', key: 'email' },
      ],
      actions: [{ name: 'Details', label: 'Details', icon: 'remove_red_eye', type: 'link' }],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      sortState: 'asc',
      needUserMenus: false,
    }
    this.activatedRoute.queryParams.subscribe(params => {
      this.deparmentId = params['roleId']
    })
  }

  ngOnChanges(data: SimpleChanges) {
    this.dataSource.data = _.get(data, 'data.currentValue')
    this.length = this.dataSource.data.length
  }
  ngAfterViewInit() {

  }

  applyFilter(filterValue: any) {
    this.isSearched = true
    if (filterValue) {
      let fValue = filterValue.trim()
      fValue = filterValue.toLowerCase()
      this.dataSource.filter = fValue
      this.getAllActiveUsersAPI(fValue)
    } else {
      this.dataSource.filter = ''
      this.dataSource.data = []
    }
  }

  buttonClick(action: string, row: any) {
    if (this.tableData) {
      const isDisabled = _.get(_.find(this.tableData.actions, ac => ac.name === action), 'disabled') || false
      if (!isDisabled && this.actionsClick) {
        this.actionsClick.emit({ action, row })
      }
    }
    this.createMDOService2.searchedUserdata.subscribe(res => {
      if (res.length > 0) {
        res.forEach((element: any) => {
          element.organisations.forEach((elem: any) => {
            if (row.userId === elem.userId) {
              const roles = elem.roles
              if (roles.includes('MDO_ADMIN') || roles.includes('STATE_ADMIN')) {
                this.createMDOService2.adminButton.next(true)
              } else {
                this.createMDOService2.adminButton.next(false)
              }
            }
          })
        })
      }
    })

  }
  getAllActiveUsersAPI(searchString: string) {
    this.userService.searchUserByenter(searchString, this.deparmentId).subscribe(res => {
      this.getAllUserByKey(res.result.response.content)
    })

  }
  getAllUserByKey(userObj: any) {
    if (userObj && userObj !== null && userObj !== undefined) {
      this.dataSource.data = []
      this.createMDOService2.searchedUserdata.next(userObj)
      userObj.forEach((users: any) => {
        const obj: IUser = {
          userId: users.id,
          fullname: `${users.firstName}`,
          // fullname: `${users.firstName} ${users.lastName}`,
          email: this.profileUtilSvc.emailTransform(users.profileDetails.personalDetails.primaryEmail),
        }
        this.dataSource.data.push(obj)
        this.dataSource.data = this.dataSource.data.slice()
      })
    }
    return []

  }

  getFinalColumns() {
    if (this.tableData !== undefined) {
      const columns = _.map(this.tableData.columns, c => c.key)
      if (this.tableData.actions && this.tableData.actions.length > 0) {
        columns.push('Actions')
      }
      if (this.tableData.needCheckBox) {
        columns.splice(0, 0, 'select')
      }
      if (this.tableData.needHash) {
        columns.splice(0, 0, 'SR')
      }
      if (this.tableData.actions && this.tableData.actions.length > 0) {
        // columns.push('Menu')
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
}
