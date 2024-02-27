import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipSearchComponent } from './clip-search.component';

describe('ClipSearchComponent', () => {
  let component: ClipSearchComponent;
  let fixture: ComponentFixture<ClipSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClipSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClipSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
