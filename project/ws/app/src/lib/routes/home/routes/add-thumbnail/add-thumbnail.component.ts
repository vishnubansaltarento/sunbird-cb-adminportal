import { Component, OnInit, Input, Inject, Output, EventEmitter, OnDestroy } from '@angular/core'
// import { LoaderService } from '@ws/author/src/lib/services/loader.service'
// import {
//   IAuthoringPagination,
// } from '@ws/author/src/lib/interface/authored'
// import { AccessControlService } from '@ws/author/src/lib/modules/shared/services/access-control.service'
// import { MyContentService } from '../../../../my-content/services/my-content.service'
import { Subscription } from 'rxjs'
import { FormGroup, FormBuilder } from '@angular/forms'
// import { EditorContentService } from '@ws/author/src/lib/routing/modules/editor/services/editor-content.service'
// import { CollectionStoreService } from '../../../../editor/routing/modules/collection/services/store.service'
// import { CollectionResolverService } from '../../../../editor/routing/modules/collection/services/resolver.service'
// import { NsContent } from '@ws-widget/collection/src/lib/_services/widget-content.model'
// import { NSContent } from '@ws/author/src/lib/interface/content'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { DomSanitizer } from '@angular/platform-browser'
/* tslint:disable */
import _ from 'lodash'
import { environment } from '../../../../../../../../../src/environments/environment'
import { SectorsService } from '../sectors/sectors.service'
/* tslint:enable */
@Component({
  selector: 'ws-auth-add-thumbnail',
  templateUrl: './add-thumbnail.component.html',
  styleUrls: ['./add-thumbnail.component.scss'],
  //providers: [CollectionStoreService, CollectionResolverService, EditorContentService],
})
export class AddThumbnailComponent implements OnInit, OnDestroy {
  // contentMeta!: NSContent.IContentMeta
  toggle: any = null
  currentParentId!: string
  startForm!: FormGroup
  public status = 'draft'
  userId!: string
  searchLanguage = ''
  queryFilter = ''
  currentFilter = 'myimages'
  public pagination!: any
  isAdmin = false
  newDesign = true
  public imageList!: any
  public fetchError = false
  showLoadMore!: boolean
  totalContent!: number
  routerSubscription = <Subscription>{}
  isChecked: boolean
  isEditEnabled = false
  thumbanilSelectval!: string
  @Input() stage = 1
  @Input() type = ''
  @Output() addAppIcon = new EventEmitter<string>()

  canUpdate = true
  @Input() isUpdate = false
  showMainContent: Boolean = true
  srcResult: any
  public imagePath: any
  imgURL: any
  public message: string | undefined

  constructor(
    private sectotsService: SectorsService,
    public dialogRef: MatDialogRef<AddThumbnailComponent>,
    // private myContSvc: MyContentService,
    private sanitizer: DomSanitizer,
    //private accessService: AccessControlService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    //private contentService: EditorContentService,
  ) {
    //this.userId = this.accessService.userId
    this.isChecked = false
  }

  ngOnInit() {
    this.pagination = {
      offset: 0,
      limit: 24,
    }
    this.startForm = this.formBuilder.group({
      thumbnail: [],
    })
    this.filter('myimages')
    this.imageList = []

  }

  ngOnDestroy() {
  }

  onFileSelected(files: any) {
    if (files.length === 0) {
      return
    }

    const mimeType = files[0].type
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.'
      return
    }
    this.message = ''
    const reader = new FileReader()
    this.imagePath = files[0]
    this.isChecked = true
    reader.readAsDataURL(files[0])
    reader.onload = _event => {
      this.imgURL = reader.result
    }
  }

  showHideButton() {
    this.showMainContent = this.showMainContent ? false : true
  }

  onValChange(val: any | null = null) {
    this.isChecked = true
    this.thumbanilSelectval = val ? val.identifier : ''
    this.toggle = val
  }

  filter(key: string | 'myimages' | 'all') {
    if (key) {
      this.fetchContent(false, null)
    }
  }
  changeToDefaultImg($event: any) {
    $event.target.src = '/assets/instances/eagle/app_logos/default.png'
  }
  fetchContent(loadMoreFlag: boolean, createdBy: string | null) {
    console.log("loadMoreFlag ", loadMoreFlag)
    const requestData = {
      request: {
        filters: {
          createdBy,
          compatibilityLevel: { min: 1, max: 2 },
          contentType: ['Asset'],
          mediaType: ['image'],
          status: ['Live', 'Review', 'Draft', 'Processing'],
        },
        query: this.queryFilter,
        // pageNo: loadMoreFlag ? this.pagination.offset : 0,
        sort_by: { lastUpdatedOn: 'desc' },
        // pageSize: this.pagination.limit

      },
    }

    this.sectotsService.fetchImagesContent(requestData).subscribe((resp: any) => {
      console.log("result, ", resp)
    }, (error) => {
      console.log(error)
    })

    // this.loadService.changeLoad.next(true)
    // const observable =
    //   this.myContSvc.fetchContent(requestData)
    // this.loadService.changeLoad.next(true)
    // observable.subscribe(
    //   data => {
    //     this.loadService.changeLoad.next(false)

    //     this.imageList =
    //       loadMoreFlag && !this.queryFilter
    //         ? (this.imageList || []).concat(
    //           data && data.result && data.result.content ? _.uniqBy(data.result.content, 'identifier') : [],
    //         )
    //         : data && data.result.content
    //           ? _.uniqBy(data.result.content, 'identifier')
    //           : []
    //     this.totalContent = data && data.result.response ? data.result.response.totalHits : 0
    //     // this.showLoadMore =
    //     //   this.pagination.offset * this.pagination.limit + this.pagination.limit < this.totalContent
    //     //     ? true`
    //     //     : false
    //     this.fetchError = false
    //   },
    //   () => {
    //     this.fetchError = true
    //     this.imageList = []
    //     this.showLoadMore = false
    //     this.loadService.changeLoad.next(false)
    //   },
    // )
  }
  public bypass(uri: string) {
    // tslint:disable-next-line: triple-equals
    if (uri && uri.indexOf(environment.contentBucket) != -1) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(uri)
    }
    return '/assets/instances/eagle/app_logos/default.png'
  }
  public uploadThumbnail() {
    this.dialogRef.close({ appURL: this.toggle ? this.toggle.artifactUrl : '' })
  }

  public uploadSelectedThumbnail() {
    this.dialogRef.close({ file: this.imagePath })
  }

  getUrl(url: string) {
    console.log("url ", url)
    // if (this.contentService.getChangedArtifactUrl(url)) {
    //   return this.sanitizer.bypassSecurityTrustResourceUrl(this.contentService.getChangedArtifactUrl(url))
    // }
    return '/assets/instances/eagle/app_logos/default.png'
  }

}
