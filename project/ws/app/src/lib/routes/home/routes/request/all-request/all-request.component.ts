import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RequestServiceService } from '../request-service.service';

@Component({
  selector: 'ws-app-all-request',
  templateUrl: './all-request.component.html',
  styleUrls: ['./all-request.component.scss']
})
export class AllRequestComponent implements OnInit {

  btnList!: any
  tableData!: any
  reportSectionData: any
  public sideNavBarOpenedMain = true
  public screenSizeIsLtMedium = false
  // private defaultSideNavBarOpenedSubscription: any
  lastUpdatedOn!: any
  pageNo = 0;
  pageSize = 10;
  requestListData: any[] = [];
  requestCount: any
  isUnassigned: boolean = false;
  isAssigned: boolean = false;
  inProgress: boolean = false;
  invalid: boolean = false;
  dataSource: any
  displayedColumns: string[] = ["RequestId", "title", "requestType", "requestStatus", "assignee", "requestedOn", "interests", "action"]
  dialogRef: any
  queryParams: any;
  statusCards = [
    {
      title:"Unassigned",
      count:234,
    },
    {
      title:"Assigned",
      count:44,
    },
    {
      title:"In-progress",
      count:12,
    },
    {
      title:"Fulfilled",
      count:223,
    },
    {
      title:"Invalid",
      count:125,
    }
  ]


  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private requestService: RequestServiceService) {}

  ngOnInit() {
    this.getRequestList()
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }

  getRequestList() {
    const request = {
      filterCriteriaMap: {},
      requestedFields: [],
      facets: [],
      pageNumber: this.pageNo,
      pageSize: this.pageSize,
      orderBy: "createdOn",
      orderDirection: "ASC"
    }
    this.requestService.getRequestList(request).subscribe((data:any) => {
      this.requestListData = data.data
      if (this.requestListData) {
        this.requestCount = data.totalCount

        this.requestListData.map((data: any) => {
          // if (data.createdOn) {
          //   data.createdOn = this.datePipe.transform(data.createdOn, 'MMM d, y')
          // }
          if (data.assignedProvider) {
            data.assignedProvider = data.assignedProvider.providerName
          }
          if (data.status === 'Unassigned') {
            this.isUnassigned = true
          }
          else if (data.status === 'Assigned') {
            this.isAssigned = true
          }
          else if (data.status === 'Inprogress') {
            this.inProgress = true
          }
          else if (data.status === 'invalid') {
            this.invalid = true
          }
        })
        this.dataSource = new MatTableDataSource<any>(this.requestListData)
      }
    })



  }

  onClickMenu(item:any, action:string){
  switch (action) {
    case 'viewContent':

      this.queryParams = {
      id: item.demand_id,
      name: 'view',
    }
      this.router.navigate(['/app/home/request-details'], { queryParams: this.queryParams })
      break
    case 'invalidContent':
      //  this.showConformationModal(_event.row, _event.action)
      break
    case 'assignContent':
      //  this.openAssignlistPopup()
      break
    case 'reAssignContent':
      // this.showConformationModal(_event.row, _event.action)
      break
    case 'copyContent':
        this.queryParams = {
          id: item.demand_id,
          name: 'copy',
        }
          this.router.navigate(['/app/home/request-details'], { queryParams: this.queryParams })
      break
  }

  }

  navigateToDetails(id: any) {
    this.queryParams = {
      id: id,
      name: 'view',
    }
    this.router.navigate(['/author/cbp/demand-details-form'], { queryParams: this.queryParams })
  }

  onChangePage(event: any) {
    this.pageNo = event.pageIndex
    this.pageSize = event.pageSize
    this.getRequestList()
    }

}
