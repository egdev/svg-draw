import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgAdminComponent } from './svg-admin.component';

describe('SvgAdminComponent', () => {
  let component: SvgAdminComponent;
  let fixture: ComponentFixture<SvgAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
