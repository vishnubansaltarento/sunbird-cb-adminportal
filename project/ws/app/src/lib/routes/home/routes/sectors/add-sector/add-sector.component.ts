import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import _ from 'lodash'
import { AddThumbnailComponent } from '../../add-thumbnail/add-thumbnail.component'
import { ImageCropComponent } from '../../image-crop/image-crop.component'
import { environment } from '../../../../../../../../../../src/environments/environment'

@Component({
  selector: 'ws-app-add-sector',
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
      appIcon: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {


  }

  goToList() {
    this.router.navigateByUrl("/app/home/sectors")
  }

  onSubmit() {

  }

  generateUrl(oldUrl: string) {
    const chunk = oldUrl ? oldUrl.split('/') : []
    const newChunk = environment.contentBucket.split('/')
    const newLink = []
    for (let i = 0; i < chunk.length; i += 1) {
      if (i === 2) {
        newLink.push(newChunk[i])
      } else if (i === 3) {
        newLink.push(environment.contentBucket)
      } else {
        newLink.push(chunk[i])
      }
    }
    const newUrl = newLink.join('/')
    return newUrl
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig()
    const dialogRef = this.dialog.open(AddThumbnailComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(data => {
      if (data && data.appURL) {
        this.addSectorForm.controls.appIcon.setValue(this.generateUrl(data.appURL))
      } else if (data && data.file) {
        this.uploadAppIcon(data.file)
      }
    })
  }

  uploadAppIcon(file: File) {
    if (!file) {
      return
    }
    const fileName = file.name

    if (
      !(
        ['.png', '.jpg', '.jpeg'].indexOf(
          `.${fileName
            .toLowerCase()
            .split('.')
            .pop()}`,
        ) > -1
      )
    ) {

      return
    }

    if (file.size > (1 * 1024 * 1024)) {
      return
    }

    const dialogRef = this.dialog.open(ImageCropComponent, {
      width: '70%',
      data: {
        isRoundCrop: false,
        imageFile: file,
        width: 24,
        height: 24,
        isThumbnail: true,
        imageFileName: fileName,
      },
    })
  }
}
