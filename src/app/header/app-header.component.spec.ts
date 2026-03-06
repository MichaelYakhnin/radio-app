import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideRouter } from "@angular/router";
import { AppHeaderComponent } from "./app-header.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("AppHeaderComponent", () => {

  let fixture: ComponentFixture<AppHeaderComponent>;
  let component: AppHeaderComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([])
      ],
      imports: [AppHeaderComponent]
    });

    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
