import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { environment } from '../../../../../../../../../src/environments/environment'
@Injectable({
  providedIn: 'root',
})

export class SectorsService {

  SEARCH = 'apis/proxies/v8/sunbirdigot/read'
  ACTION_CONTENT_V3 = 'apis/proxies/v8/action/content/v3/'
  CONTENT_BASE_STATIC = '/artifacts'
  UPLOAD_FILE = 'apis/proxies/v8/upload/action/content/v3/'
  FIXED_FILE_NAME = [
    'channel.json',
  ]

  constructor(
    private http: HttpClient) { }

  fetchImagesContent(searchData: any) {
    return this.http.post(this.SEARCH, searchData).pipe(
      map((data: any) => data)
    )
  }

  createImageContent(requestBody: any) {
    return this.http.post<any>(
      `${this.ACTION_CONTENT_V3}create`,
      requestBody,
    )
  }

  upload(
    data: FormData,
    contentData: any,
  ): Observable<any> {
    const file = data.get('content') as File
    let fileName = file.name
    if (this.FIXED_FILE_NAME.indexOf(fileName) < 0) {
      fileName = this.appendToFilename(fileName)
    }
    const newFormData = new FormData()
    newFormData.append('data', file, fileName)
    return this.http.post<any>(
      `${this.UPLOAD_FILE}upload/${contentData.contentId}`,
      newFormData
    )
  }

  appendToFilename(filename: string) {
    const timeStamp = new Date().getTime()
    const dotIndex = filename.lastIndexOf('.')
    if (dotIndex === -1) {
      return filename + timeStamp
    }
    return filename.substring(0, dotIndex) + timeStamp + filename.substring(dotIndex)
  }

  getChangedArtifactUrl(url: string) {
    if (url && url.length > 0) {
      const tempData = url.split('content')
      return `https://${environment.sitePath}/${environment.contentBucket}/content${tempData[tempData.length - 1]}`
    }
    return url
  }
}
