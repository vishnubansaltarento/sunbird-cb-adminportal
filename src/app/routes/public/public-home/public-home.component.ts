import { Component, OnInit } from '@angular/core'
import { Router, Event } from '@angular/router'
@Component({
  selector: 'ws-public-home',
  templateUrl: './public-home.component.html',
  styleUrls: ['./public-home.component.scss']
})
export class PublicHomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      console.log('event', event)
      if (window.location.href.includes('public/home')) {
        window.location.href = '/public/logout'
      }
    })
  }

}
