import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemMetadataListElementComponent } from './item-metadata-list-element.component';
import { By } from '@angular/platform-browser';
import { ItemMetadataRepresentation } from '../../../../core/shared/metadata-representation/item/item-metadata-representation.model';

const mockItemMetadataRepresentation = new ItemMetadataRepresentation();

describe('ItemMetadataListElementComponent', () => {
  let comp: ItemMetadataListElementComponent;
  let fixture: ComponentFixture<ItemMetadataListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ItemMetadataListElementComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemMetadataListElementComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemMetadataListElementComponent);
    comp = fixture.componentInstance;
    comp.metadataRepresentation = mockItemMetadataRepresentation;
    fixture.detectChanges();
  }));

  it('should call a listable-object-component-loader component and pass the item-metadata-representation', () => {
    const objectLoader = fixture.debugElement.query(By.css('ds-listable-object-component-loader')).nativeElement;
    expect(objectLoader.object).toBe(mockItemMetadataRepresentation);
  });

});
