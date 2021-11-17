import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TvComponent } from "./tv.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("TvComponent", () => {

  let fixture: ComponentFixture<TvComponent>;
  let component: TvComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [TvComponent]
    });

    fixture = TestBed.createComponent(TvComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
