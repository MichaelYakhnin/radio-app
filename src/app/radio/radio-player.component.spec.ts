import { NO_ERRORS_SCHEMA } from "@angular/core";
import { RadioPlayerComponent } from "./radio-player.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("RadioPlayerComponent", () => {

  let fixture: ComponentFixture<RadioPlayerComponent>;
  let component: RadioPlayerComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [RadioPlayerComponent]
    });

    fixture = TestBed.createComponent(RadioPlayerComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
