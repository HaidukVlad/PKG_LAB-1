import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorConverterComponent } from './color-converter.component';

describe('ColorConverterComponent', () => {
  let component: ColorConverterComponent;
  let fixture: ComponentFixture<ColorConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorConverterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
