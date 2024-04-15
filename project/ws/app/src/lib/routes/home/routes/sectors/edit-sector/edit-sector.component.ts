import { Component, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import * as _ from 'lodash'
import { SectorsService } from '../sectors.service'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'ws-app-edit-sector',
  templateUrl: './edit-sector.component.html',
  styleUrls: ['./edit-sector.component.scss'],
})
export class EditSectorComponent implements OnInit {

  currentUser!: string | null
  addSectorForm: FormGroup
  disableCreateButton = false
  myreg = /^[a-zA-Z0-9.\-_$/:[\]' '!]+$/
  isDisabled = true
  myForm: FormGroup
  subSectors: any = []
  sectorDetails: any

  constructor(
    public dialog: MatDialog,
    private configSvc: ConfigurationsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private sectorsService: SectorsService,
    private sanitizer: DomSanitizer,
  ) {
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
    this.addSectorForm = new FormGroup({
      sectorTitle: new FormControl({ value: '', disabled: this.isDisabled }, [Validators.required, Validators.pattern(this.myreg)]),
      appIcon: new FormControl('', [Validators.required]),
    })
    this.addSectorForm.controls['sectorTitle'].setValue(this.sectorDetails.name)
    this.addSectorForm.controls['appIcon'].setValue(this.sectorDetails.imgUrl)
    this.myForm = this.formBuilder.group({
      textboxes: this.formBuilder.array([], Validators.required),
    })
    this.addTextbox('Energy')
    this.addTextbox('Solar Power')
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

  }

  goToList() {
    this.router.navigateByUrl('/app/home/sectors')
  }

  addSubSector() {
  }

  onSubSectorSubmit() {
    console.log("form ", this.myForm)
  }

  getUrl(url: string) {
    if (this.sectorsService.getChangedArtifactUrl(url)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.sectorsService.getChangedArtifactUrl(url))
    }
    return '/assets/instances/eagle/app_logos/default.png'
  }
}
