import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCopyDetailsComponent } from './request-copy-details.component';

describe('RequestCopyDetailsComponent', () => {
  let component: RequestCopyDetailsComponent;
  let fixture: ComponentFixture<RequestCopyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestCopyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCopyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
