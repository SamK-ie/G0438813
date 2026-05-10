import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullCreditsPage } from './full-credits.page';

describe('FullCreditsPage', () => {
  let component: FullCreditsPage;
  let fixture: ComponentFixture<FullCreditsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FullCreditsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
