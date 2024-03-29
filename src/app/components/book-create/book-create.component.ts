import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../models/book.model';
import { Router } from '@angular/router';
import { Author } from '../../models/author.model';
import { db } from '../../services/db';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.scss'],
})
export class BookCreateComponent implements OnInit {
  bookForm!: FormGroup;
  authors: Author[] = [];
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
    db.authors.toArray().then(authors => {
      this.authors = authors;
    }).catch(error => {
      console.error('Error fetching authors:', error);
    });
  }

  createBook(): void {
    if (this.bookForm.valid) {
      const newBook: Book = this.bookForm.value;

      db.books.add(newBook).then(() => {
        console.log('Book created successfully');
        this.router.navigateByUrl('/');
      }).catch(error => {
        console.error('Error creating book:', error);
      });
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
