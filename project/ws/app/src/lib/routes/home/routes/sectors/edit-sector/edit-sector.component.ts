import { Component, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import _ from 'lodash'

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
  isDisabled: boolean = true
  myForm: FormGroup
  subSectors: any = []

  constructor(
    public dialog: MatDialog,
    private configSvc: ConfigurationsService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
    this.addSectorForm = new FormGroup({
      sectorTitle: new FormControl({ value: '', disabled: this.isDisabled }, [Validators.required, Validators.pattern(this.myreg)]),
    })
    this.addSectorForm.controls['sectorTitle'].setValue('Sector 909')
    this.myForm = this.formBuilder.group({
      textboxes: this.formBuilder.array([])
    })
    this.addTextbox('Energy')
  }

  get textboxes() {
    return this.myForm.get('textboxes') as FormArray
  }

  addTextbox(value: string = '') {
    this.textboxes.push(
      this.formBuilder.control({ value: value, disabled: value.length }, [Validators.required])
    )
  }

  removeTextbox(index: number) {
    this.textboxes.removeAt(index)
  }

  ngOnInit() {

  }

  goToList() {
    this.router.navigateByUrl("/app/home/sectors")
  }

  onSubmit() {
  }

  addSubSector() {
  }

  onSubSectorSubmit() {
    console.log("myForm  ", this.myForm)
  }
}
