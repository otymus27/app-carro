import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Marcasdetails } from './marcasdetails';

describe('Marcasdetails', () => {
  let component: Marcasdetails;
  let fixture: ComponentFixture<Marcasdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Marcasdetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Marcasdetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
