import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageApplicationComponent } from './message-application.component';

describe('MessageApplicationComponent', () => {
  let component: MessageApplicationComponent;
  let fixture: ComponentFixture<MessageApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageApplicationComponent]
    });
    fixture = TestBed.createComponent(MessageApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
