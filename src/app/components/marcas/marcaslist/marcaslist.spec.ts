import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Marcaslist } from './marcaslist';

describe('Marcaslist', () => {
  let component: Marcaslist;
  let fixture: ComponentFixture<Marcaslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Marcaslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Marcaslist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
