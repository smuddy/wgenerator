import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Storage} from '@angular/fire/storage';

import {FileComponent} from './file.component';

describe('FileComponent', () => {
  let component: FileComponent;
  let fixture: ComponentFixture<FileComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [FileComponent],
      providers: [{provide: Storage, useValue: {}}],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
