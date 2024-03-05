import { Component } from '@angular/core';
import { BookService } from './services/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'library';

  constructor(private bookService: BookService, private router: Router) {}

  resetData(): void {
    this.bookService.resetData().subscribe(
      (response) => {
        console.log('Data reset successfully:', response);
        this.router.navigate(['/']);
        window.location.reload();
      },
      (error) => {
        console.error('Error resetting data:', error);
      }
    );
  }
}
