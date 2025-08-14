import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carrosdetails } from './carrosdetails';

describe('Carrosdetails', () => {
  let component: Carrosdetails;
  let fixture: ComponentFixture<Carrosdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carrosdetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carrosdetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
