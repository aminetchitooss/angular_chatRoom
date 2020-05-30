import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNameModalComponent } from './create-name-modal.component';

describe('CreateNameModalComponent', () => {
  let component: CreateNameModalComponent;
  let fixture: ComponentFixture<CreateNameModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNameModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
