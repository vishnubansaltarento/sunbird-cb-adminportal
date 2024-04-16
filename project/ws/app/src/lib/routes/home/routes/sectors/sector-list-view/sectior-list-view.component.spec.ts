import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { SectorListViewComponent } from './sector-list-view.component'

describe('SectorListViewComponent', () => {
  let component: SectorListViewComponent
  let fixture: ComponentFixture<SectorListViewComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SectorListViewComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorListViewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
