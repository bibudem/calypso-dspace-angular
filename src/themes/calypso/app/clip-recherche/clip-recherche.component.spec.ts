import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipRechercheComponent } from './clip-recherche.component';

describe('ClipRechercheComponent', () => {
  let component: ClipRechercheComponent;
  let fixture: ComponentFixture<ClipRechercheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClipRechercheComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClipRechercheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
