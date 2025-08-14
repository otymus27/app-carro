import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carroslist } from './carroslist';

describe('Carroslist', () => {
  let component: Carroslist;
  let fixture: ComponentFixture<Carroslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carroslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carroslist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
