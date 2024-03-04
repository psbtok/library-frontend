import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.scss'],
})
export class BookCreateComponent implements OnInit {
  bookForm!: FormGroup;
  authors: any[] = []; // Assuming authors have an 'id' and 'name' property
  validationMessages: { [key: string]: { [key: string]: string } } = {
    title: {
      required: 'Title is required.',
    },
    author_uuid: {
      required: 'Author is required.',
    },
    pages: {
      required: 'Pages is required.',
      min: 'Pages must be greater than or equal to 1.',
    },
    language: {
      required: 'Language is required.',
    },
    genre: {
      required: 'Genre is required.',
    },
    description: {
      required: 'Description is required.',
    },
  };

  constructor(
    private fb: FormBuilder, 
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAuthors();
  }

  initForm(): void {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author_uuid: [null, Validators.required],
      pages: [0, [Validators.required, Validators.min(1)]],
      language: ['', Validators.required],
      genre: ['', Validators.required],
      description: ['', Validators.required],
      uuid: [''],
    });
  }

  loadAuthors(): void {
    this.bookService.getAuthors().subscribe(
      (authors) => {
        this.authors = authors;
      },
      (error) => {
        console.error('Error fetching authors:', error);
      }
    );
  }

  createBook(): void {
    if (this.bookForm.valid) {
      const newBook: Book = this.bookForm.value;

      this.bookService.createBook(newBook).subscribe(
        (response) => {
          console.log('Book created successfully:', response);
          this.router.navigateByUrl('/books');
        },
        (error) => {
          console.error('Error creating book:', error);
        }
      );
    } else {
      this.showValidationErrors();
    }
  }

  showValidationErrors(): void {
    Object.keys(this.bookForm.controls).forEach((field) => {
      const control = this.bookForm.get(field);

      if (control && control.invalid) {
        const messages = this.validationMessages[field];
        Object.keys(control.errors!).forEach((key) => {
          console.log(messages[key]);
        });
      }
    });
  }
}
