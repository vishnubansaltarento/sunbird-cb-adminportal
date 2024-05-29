import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const API_END_POINTS = {
  GET_REQUEST_DATA: '/apis/proxies/v8/demand/content/search',
  GET_FILTER_ENTITY: 'apis/proxies/v8/competency/v4/search',
  GET_REQUEST_TYPE_LIST: '/apis/proxies/v8/org/v1/search',
  CREATE_DEMAND_REQUEST: '/apis/proxies/v8/demand/content/create',
  MARK_INVALID: '/apis/proxies/v8/demand/content/update/status',
  GET_REQUEST_DATA_BYID: 'apis/proxies/v8/demand/content/read',
}

@Injectable({
  providedIn: 'root',
})
export class RequestServiceService {

  constructor(private http: HttpClient) { }

  getFilterEntity(filter: object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_FILTER_ENTITY}`, filter).pipe(map(res => _.get(res, 'result.competency')))
  }

  getRequestTypeList(request: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_REQUEST_TYPE_LIST}`, request).pipe(map(res => _.get(res, 'result.response.content')))
  }

  createDemand(request: any) {
   return this.http.post<any>(`${API_END_POINTS.CREATE_DEMAND_REQUEST}`, request)
  }

  getRequestList(request: any) {
   return this.http.post<any>(`${API_END_POINTS.GET_REQUEST_DATA}`, request).pipe(map(res => _.get(res, 'result.result')))
  }

  markAsInvalid(request: any) {
    return this.http.post<any>(`${API_END_POINTS.MARK_INVALID}`, request)
   }

  getRequestDataById(demandId: any) {
    return this.http.get<any>(`${API_END_POINTS.GET_REQUEST_DATA_BYID}/${demandId}`).pipe(map(res => _.get(res, 'result.result')))
  }
}
