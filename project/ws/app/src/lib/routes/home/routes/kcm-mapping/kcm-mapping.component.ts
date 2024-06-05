import { Component, OnInit } from '@angular/core'
import { environment } from '../../../../../../../../../src/environments/environment'

@Component({
  selector: 'ws-app-kcm-mapping',
  templateUrl: './kcm-mapping.component.html',
  styleUrls: ['./kcm-mapping.component.scss'],
})
export class KCMMappingComponent implements OnInit {
  environmentVal: any
  taxonomyConfig: any

  constructor() { }

  ngOnInit() {
    this.environmentVal = environment
    this.taxonomyConfig = [
      // {
      //     "frameworkId" :"devmvp3",
      //     "config" : [
      //         {
      //             "index": 1,
      //             "category": "position",
      //             "icon": "settings",
      //             "color": "#1d2327"
      //         },
      //         {
      //             "index": 2,
      //             "category": "role",
      //             "icon": "extension",
      //             "color": "#541675"
      //         },
      //         {
      //             "index": 3,
      //             "category": "competency",
      //             "icon": "bar_chart",
      //             "color": "#9a6c80"
      //         },
      //         {
      //             "index": 4,
      //             "category": "competencylevel",
      //             "icon": "account_box",
      //             "color": "#d8666a"
      //         }
      //     ]
      // },
      // {
      //     "frameworkId" :"compass_fw",
      //     "config" : [
      //         {
      //             "index": 1,
      //             "category": "board",
      //             "icon": "settings",
      //             "color": "#1d2327"
      //         },
      //         {
      //             "index": 2,
      //             "category": "medium",
      //             "icon": "extension",
      //             "color": "#541675"
      //         },
      //         {
      //             "index": 3,
      //             "category": "subject",
      //             "icon": "bar_chart",
      //             "color": "#9a6c80"
      //         },
      //         {
      //             "index": 4,
      //             "category": "gradeLevel",
      //             "icon": "account_box",
      //             "color": "#d8666a"
      //         },
      //         {
      //             "index": 5,
      //             "category": "topic",
      //             "icon": "account_box",
      //             "color": "#d8666a"
      //         }
      //     ]
      // },
      // {
      //     "frameworkId" :"fracing_fw",
      //     "config" : [
      //         {
      //             "index": 1,
      //             "category": "taxonomyCategory1",
      //             "icon": "settings",
      //             "color": "#1d2327"
      //         },
      //         {
      //             "index": 2,
      //             "category": "taxonomyCategory2",
      //             "icon": "extension",
      //             "color": "#541675"
      //         },
      //         {
      //             "index": 3,
      //             "category": "taxonomyCategory3",
      //             "icon": "bar_chart",
      //             "color": "#9a6c80"
      //         },
      //         {
      //             "index": 4,
      //             "category": "taxonomyCategory4",
      //             "icon": "account_box",
      //             "color": "#d8666a"
      //         },
      //         {
      //             "index": 5,
      //             "category": "taxonomyCategory5",
      //             "icon": "account_box",
      //             "color": "#d8666a"
      //         }
      //     ]
      // },
      // {
      //     "frameworkId" :"igot",
      //     "config" : [
      //         {
      //             "index": 1,
      //             "category": "domain",
      //             "icon": "settings",
      //             "color": "#1d2327"
      //         },
      //         {
      //             "index": 2,
      //             "category": "subject",
      //             "icon": "extension",
      //             "color": "#541675"
      //         },
      //         {
      //             "index": 3,
      //             "category": "difficultyLevel",
      //             "icon": "bar_chart",
      //             "color": "#9a6c80"
      //         },
      //         {
      //             "index": 4,
      //             "category": "difficultyLevel",
      //             "icon": "account_box",
      //             "color": "#d8666a"
      //         },
      //         {
      //             "index": 5,
      //             "category": "testcategory",
      //             "icon": "account_box",
      //             "color": "#d8666a"
      //         },
      //         {
      //             "index": 6,
      //             "category": "testcategory",
      //             "icon": "account_box",
      //             "color": "#d8666a"
      //         },
      //         {
      //             "index": 7,
      //             "category": "testcategory2",
      //             "icon": "account_box",
      //             "color": "#d8666a"
      //         },
      //     ]
      // },
      {
        frameworkId: 'organisation_fw',
        config: [
          {
            index: 1,
            category: 'org',
            icon: 'settings',
            color: '#1d2327',
          },
          {
            index: 2,
            category: 'designation',
            icon: 'person',
            color: '#541675',
          },
          {
            index: 3,
            category: 'competency',
            icon: 'extension',
            color: '#0074b6',
          },
        ],
      },
      {
        frameworkId: 'cats_fw',
        config: [
          {
            index: 1,
            category: 'cats_fw_competencyarea',
            icon: 'settings',
            color: '#1d2327',
          },
          {
            index: 2,
            category: 'cats_fw_theme',
            icon: 'extension',
            color: '#541675',
          },
          {
            index: 3,
            category: 'cats_fw_subtheme',
            icon: 'extension',
            color: '#541675',
          },
        ],
      },
    ]
  }

}
