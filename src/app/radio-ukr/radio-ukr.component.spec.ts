import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioRuComponent } from './radio-ru.component';

describe('RadioRuComponent', () => {
  let component: RadioRuComponent;
  let fixture: ComponentFixture<RadioRuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioRuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioRuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
