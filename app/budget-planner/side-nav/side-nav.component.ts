import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
  isSlideOut = true;

  constructor(private router: Router) {}

  public toggleSlideOut(): void {
    this.isSlideOut = !this.isSlideOut;
  }

  public onDash(): void {
    this.router.navigate(['/budget-planner/dashboard']);
  }

  public onProfile(): void {
    this.router.navigate(['/budget-planner/profile']);
  }

  public onHistory(): void {
    this.router.navigate(['/budget-planner/history']);
  }

  public onLogout(): void {
    this.router.navigate(['/budget-planner/login']);
  }

  public isActive(route: string): boolean {
    return this.router.url === route;
  }
}
