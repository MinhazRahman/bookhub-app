import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartStatusComponent } from './shopping-cart-status.component';

describe('ShoppingCartStatusComponent', () => {
  let component: ShoppingCartStatusComponent;
  let fixture: ComponentFixture<ShoppingCartStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppingCartStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingCartStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
