import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root',
})
export class SectorsService {

  SEARCH = 'apis/proxies/v8/sunbirdigot/read'

  constructor(
    private http: HttpClient) { }

  fetchImagesContent(searchData: any) {
    return this.http.post(this.SEARCH, searchData)
  }

}
