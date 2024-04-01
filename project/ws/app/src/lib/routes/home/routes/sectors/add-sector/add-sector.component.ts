import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import _ from 'lodash'

@Component({
  selector: 'ws-app-sectors',
  templateUrl: './add-sector.component.html',
  styleUrls: ['./add-sector.component.scss'],
})
export class AddSectorComponent implements OnInit {

  currentUser!: string | null
  addSectorForm: FormGroup
  disableCreateButton = false
  myreg = /^[a-zA-Z0-9.\-_$/:[\]' '!]+$/

  constructor(
    public dialog: MatDialog,
    private configSvc: ConfigurationsService,
    private router: Router
  ) {
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
    this.addSectorForm = new FormGroup({
      sectorTitle: new FormControl('', [Validators.required, Validators.pattern(this.myreg)]),
    })
  }

  ngOnInit() {

  }

  goToList() {
    this.router.navigateByUrl("/app/home/sectors")
  }

  onSubmit() {

  }
}
