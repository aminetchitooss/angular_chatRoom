import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGameModalComponent } from './create-game-modal.component';

describe('CreateGameModalComponent', () => {
  let component: CreateGameModalComponent;
  let fixture: ComponentFixture<CreateGameModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGameModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
