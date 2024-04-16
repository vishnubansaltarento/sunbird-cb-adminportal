import { Component, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import * as _ from 'lodash'
import { SectorsService } from '../sectors.service'
import { DomSanitizer } from '@angular/platform-browser'
import { MatSnackBar } from '@angular/material/snack-bar'
import { sectorConstants } from '../sectors-constats.model'

@Component({
  selector: 'ws-app-edit-sector',
  templateUrl: './edit-sector.component.html',
  styleUrls: ['./edit-sector.component.scss'],
})
export class EditSectorComponent implements OnInit {

  currentUser!: string | null
  addSectorForm: FormGroup
  disableCreateButton = false
  myreg = sectorConstants.nameRegex
  isDisabled = true
  myForm: FormGroup
  subSectors: any = []
  sectorDetails: any
  id: any
  loading = false

  constructor(
    public dialog: MatDialog,
    private configSvc: ConfigurationsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private sectorsService: SectorsService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
    this.addSectorForm = new FormGroup({
      sectorTitle: new FormControl({ value: '', disabled: this.isDisabled }, [Validators.required, Validators.pattern(this.myreg)]),
      imgUrl: new FormControl('', [Validators.required]),
    })

    this.myForm = this.formBuilder.group({
      textboxes: this.formBuilder.array([], Validators.required),
    })
  }

  get textboxes() {
    return this.myForm.get('textboxes') as FormArray
  }

  addTextbox(value: string = '') {
    this.textboxes.push(
      this.formBuilder.control({ value, disabled: value.length }, [Validators.required])
    )
  }

  removeTextbox(index: number) {
    this.textboxes.removeAt(index)
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id']
      if (this.id) {
        this.sectorsService.readSector(this.id).subscribe((resp: any) => {
          if (resp && resp.responseCode === 'OK' && resp.result) {
            this.sectorDetails = resp.result.sector
            this.addSectorForm.controls['sectorTitle'].setValue(this.sectorDetails.name)
            this.addSectorForm.controls['imgUrl'].setValue(this.sectorDetails.imgUrl)
            if (this.sectorDetails.children.length) {
              this.sectorDetails.children.map((child: any) => {
                this.addTextbox(child.name)
              })
            }
          }
        }, error => {
          this.snackBar.open(error, 'X', { duration: sectorConstants.duration })
        })
      }
    })
  }

  goToList() {
    this.router.navigateByUrl('/app/home/sectors')
  }

  addSubSector() {
  }

  onSubSectorSubmit() {
    const requestBody = {
      request: {
        identifier: this.sectorDetails.identifier,
        subsectors: this.sectorDetails.children,
      },
    }
    this.loading = true
    this.myForm.controls['textboxes'].value.map((el: any) => {
      requestBody.request.subsectors.push({ name: el })
    })
    this.sectorsService.createSubSectors(requestBody).subscribe((resp: any) => {
      if (resp.responseCode === 'OK') {
        this.snackBar.open('Sub-sectors are successfuly created.')
        this.router.navigate([`/app/home/sectors`])
      }
      this.loading = false
    }, error => {
      this.snackBar.open(error, 'X', { duration: sectorConstants.duration })
      this.loading = false
    })

  }

  getUrl(url: string) {
    if (this.sectorsService.getChangedArtifactUrl(url)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.sectorsService.getChangedArtifactUrl(url))
    }
    return '/assets/instances/eagle/app_logos/default.png'
  }
}
