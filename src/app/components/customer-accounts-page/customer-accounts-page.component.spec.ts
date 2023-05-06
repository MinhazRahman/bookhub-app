import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAccountsPageComponent } from './customer-accounts-page.component';

describe('CustomerAccountsPageComponent', () => {
  let component: CustomerAccountsPageComponent;
  let fixture: ComponentFixture<CustomerAccountsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerAccountsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerAccountsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
