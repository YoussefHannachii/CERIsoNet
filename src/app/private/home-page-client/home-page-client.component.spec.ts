import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageClientComponent } from './home-page-client.component';

describe('HomePageClientComponent', () => {
  let component: HomePageClientComponent;
  let fixture: ComponentFixture<HomePageClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomePageClientComponent]
    });
    fixture = TestBed.createComponent(HomePageClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
