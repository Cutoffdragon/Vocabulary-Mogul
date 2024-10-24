import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuizComponent } from './user.quiz.component';

describe('UserQuizComponent', () => {
  let component: UserQuizComponent;
  let fixture: ComponentFixture<UserQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
