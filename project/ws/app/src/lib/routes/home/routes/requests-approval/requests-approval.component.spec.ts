import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { RequestsApprovalComponent } from './requests-approval.component'

describe('RequestsApprovalComponent', () => {
  let component: RequestsApprovalComponent
  let fixture: ComponentFixture<RequestsApprovalComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RequestsApprovalComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsApprovalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
