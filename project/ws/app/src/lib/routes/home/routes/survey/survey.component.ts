import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
// import { ActivatedRoute, Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
// import { ConfigurationsService, EventService } from '@sunbird-cb/utils'
import * as moment from 'moment'
/* tslint:disable */
import _ from 'lodash'
// import { EventsService } from '../services/events.service'
// import { DialogConfirmComponent } from '../../../../../../../../../../src/app/component/dialog-confirm/dialog-confirm.component'
// import { MatSnackBar } from '@angular/material'
// import { TelemetryEvents } from '../model/telemetry.event.model'

@Component({
  selector: 'ws-app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  currentUser!: string | null
  configService: any
  department: any
  departmentID: any
  tabledata: any = []
  eventData: any = []
  data: any = []
  currentFilter = 'upcoming'

  constructor(
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private configSvc: ConfigurationsService,
    // private router: Router,
    // private events: EventService,
    // private eventSvc: EventsService,
    // private dialogue: MatDialog,
    // private snackBar: MatSnackBar,
  ) {

    this.configService = this.activeRoute.snapshot.data.configService
    if (this.configSvc.userProfile) {
      this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
      this.department = this.configSvc.userProfile && this.configSvc.userProfile.departmentName
      this.departmentID = this.configSvc.userProfile && this.configSvc.userProfile.rootOrgId
    } else {
      if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')) {
        this.departmentID = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')
      }
      if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.departmentName')) {
        this.department = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.departmentName')
        _.set(this.department, 'snapshot.data.configService.userProfile.departmentName', this.department ? this.department : '')
      }
      if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.userId')) {
        this.currentUser = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.userId')
      }
      if (this.configService.userProfile && this.configService.userProfile.departmentName) {
        this.configService.userProfile.departmentName = this.department
      }
    }

  }

  ngOnInit() {
    this.tabledata = {
      actions: [{ icon: 'file_copy', label: 'Copy', name: 'ViewCount', type: 'link' }],
      columns: [
        { displayName: 'Survey Id', key: 'surveyId' },
        { displayName: 'Survey Name', key: 'surveyName' },
        { displayName: 'Start Date', key: 'surveyStartDate' },
        { displayName: 'End Date', key: 'surveyEndDate' },

      ],
      needCheckBox: false,
      needHash: false,
      needUserMenus: false,
      sortColumn: false,
      sortState: 'asc',
      actionColumnName: 'Actions',
    }

    // this.tabledata = {
    //   columns: [
    //     { displayName: 'Role', key: 'role' },
    //     { displayName: 'Count', key: 'count' },
    //   ],
    //   actions: [{ icon: 'refresh', label: 'Refresh', name: 'ViewCount', type: 'link' }],
    //   needCheckBox: false,
    //   needHash: false,
    //   sortColumn: '',
    //   sortState: 'asc',
    //   actionColumnName: 'Refresh',
    // }
    this.getSurveysData()
  }

  getSurveysData() {
    this.data = [{
      "surveyEndDate": "2024-07-19",
      "surveyStartDate": "2024-07-19",
      "surveyId": "do_114100984529534976113",
      "surveyName": "Survey 1",
      "actions": ""
    }]
  }

  setEventListData(eventObj: any) {
    if (eventObj !== undefined) {
      const data = eventObj.result.Event
      this.eventData['pastEvents'] = []
      this.eventData['upcomingEvents'] = []
      this.eventData['archiveEvents'] = []
      Object.keys(data).forEach((index: any) => {
        const obj = data[index]
        //if (obj.createdFor && obj.createdFor[0] === this.departmentID) {
        const expiryDateFormat = this.getCustomDateFormat(obj.endDate, obj.endTime)
        const floor = Math.floor
        const hours = floor(obj.duration / 60)
        const minutes = obj.duration % 60
        const duration = (hours === 0) ? ((minutes === 0) ? '---' : `${minutes} minutes`) : (minutes === 0) ? (hours === 1) ?
          `${hours} hour` : `${hours} hours` : (hours === 1) ? `${hours} hour ${minutes} minutes` :
          `${hours} hours ${minutes} minutes`
        const creatordata = obj.creatorDetails !== undefined ? obj.creatorDetails : []
        const str = creatordata && creatordata.length > 0 ? creatordata.replace(/\\/g, '') : []
        const creatorDetails = str && str.length > 0 ? JSON.parse(str) : creatordata
        const eventDataObj = {
          identifier: obj.identifier,
          eventName: obj.name.substring(0, 100),
          eventStartDate: this.customDateFormat(obj.startDate, obj.startTime),
          eventCreatedOn: this.allEventDateFormat(obj.createdOn),
          eventDuration: duration,
          startDate: obj.startDate,
          startTime: obj.startTime,
          createdOn: obj.createdOn,
          duration: obj.duration,
          creatorDetails: (creatorDetails !== undefined ? creatorDetails.length : 0),
          eventjoined: (creatorDetails !== undefined && creatorDetails.length > 0) ?
            ((creatorDetails.length === 1) ? '1 person' : `${creatorDetails.length} people`) : ' --- ',
          lastUpdatedOn: obj.lastUpdatedOn,
          // eventThumbnail: obj.appIcon && (obj.appIcon !== null || obj.appIcon !== undefined) ?
          //   this.eventSvc.getPublicUrl(obj.appIcon) : this.eventSvc.getPublicUrl('/assets/icons/Events_default.png'),
          eventThumbnail: obj.appIcon
        }
        if (obj.status === 'Retired') {
          this.eventData['archiveEvents'].push(eventDataObj)
        } else {
          const isPast = this.compareDate(expiryDateFormat);
          (isPast) ? this.eventData['pastEvents'].push(eventDataObj) : this.eventData['upcomingEvents'].push(eventDataObj)
        }
        //}
      })
      this.filter(this.currentFilter)
    }
  }

  getCustomDateFormat(date: any, time: any) {
    const stime = time.split('+')[0]
    const hour = stime.substr(0, 2)
    const min = stime.substr(2, 3)
    return `${date} ${hour}${min}`
  }

  customDateFormat(date: string, time: string) {
    const fTime = time.split("+")
    const datetimetest = moment(`${date}T${fTime[0]}`).toISOString()
    const format = 'Do MMM YYYY HH:mm'
    const readableDateMonth = moment(datetimetest).format(format)
    const finalDateTimeValue = `${readableDateMonth}`
    return finalDateTimeValue
  }

  filter(key: string | 'timestamp' | 'best' | 'saved') {
    const upcomingEventsData: any[] = []
    const pastEventsData: any[] = []
    const archiveEventsData: any[] = []
    if (this.eventData['pastEvents'] && this.eventData['pastEvents'].length > 0) {
      this.eventData['pastEvents'].forEach((event: any) => {
        pastEventsData.push(event)
      })
    }

    if (this.eventData['upcomingEvents'] && this.eventData['upcomingEvents'].length > 0) {
      this.eventData['upcomingEvents'].forEach((event: any) => {
        upcomingEventsData.push(event)
      })
    }

    if (this.eventData['archiveEvents'] && this.eventData['archiveEvents'].length > 0) {
      this.eventData['archiveEvents'].forEach((event: any) => {
        archiveEventsData.push(event)
      })
    }

    if (key) {
      this.currentFilter = key
      switch (key) {
        case 'upcoming':
          this.data = upcomingEventsData
          break
        case 'past':
          this.data = pastEventsData
          break
        case 'archive':
          this.data = archiveEventsData
          break
        default:
          this.data = upcomingEventsData
          break
      }
    }
  }

  compareDate(selectedDate: any) {
    const now = new Date()
    const today = moment(now).format('YYYY-MM-DD HH:mm')
    return (selectedDate < today) ? true : false
  }

  allEventDateFormat(datetime: any) {
    const date = new Date(datetime).getDate()
    const year = new Date(datetime).getFullYear()
    const month = new Date(datetime).getMonth()
    const hours = new Date(datetime).getHours()
    const minutes = new Date(datetime).getMinutes()
    const seconds = new Date(datetime).getSeconds()
    const formatedDate = new Date(year, month, date, hours, minutes, seconds, 0)
    const format = 'Do MMM YYYY HH:mm'
    const readableDateMonth = moment(formatedDate).format(format)
    const finalDateTimeValue = `${readableDateMonth}`
    return finalDateTimeValue
  }

  formatTimeAmPm(futureDate: any) {
    let hours = futureDate.getHours()
    let minutes = futureDate.getMinutes()
    const ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12
    minutes = minutes < 10 ? `0${minutes}` : minutes
    const strTime = `${hours}:${minutes} ${ampm}`
    return strTime
  }

}
