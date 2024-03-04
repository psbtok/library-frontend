// author-list.component.ts

import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Author } from '../../models/author.model';

@Component({
  selector: 'app-author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.scss'],
})
export class AuthorListComponent implements OnInit {
  authors: Author[] = [];
  newAuthorName = '';
  newAuthorUuid = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.bookService.getAuthors().subscribe(
      (authors) => {
        this.authors = authors.map(author => ({ ...author, editMode: false, updatedName: author.name, updatedUuid: author.uuid }));
      },
      (error) => {
        console.error('Error fetching authors:', error);
      }
    );
  }

  toggleEditMode(author: Author): void {
    author.editMode = !author.editMode;
  }

  confirmEdit(author: any): void {
    const updatedUuid: string | undefined = author.updatedUuid;
    const updatedName: string | undefined = author.updatedName;
  
    if (updatedUuid === undefined || updatedName === undefined) {
      console.error('Invalid values for updated UUID or name.');
      return;
    }
  
    if (this.authors.some(existingAuthor => existingAuthor.uuid === updatedUuid && existingAuthor !== author)) {
      console.error('The UUID is already taken.');
      return;
    }
  
    const updatedAuthorIndex = this.authors.findIndex(existingAuthor => existingAuthor === author);
  
    if (updatedAuthorIndex !== -1) {
      // Update the existing author in the array
      this.authors[updatedAuthorIndex].uuid = updatedUuid;
      this.authors[updatedAuthorIndex].name = updatedName;
      
      // Make API call to update the author in the backend
      this.bookService.createAuthor({ uuid: updatedUuid, name: updatedName }).subscribe(
        (response) => {
          console.log('Author updated successfully:', response);
          author.editMode = false;
        },
        (error) => {
          console.error('Error updating author:', error);
        }
      );
    }
  }    

  cancelEdit(author: Author): void {
    author.editMode = false;
    author.updatedName = author.name;
    author.updatedUuid = author.uuid;
  }

  addNewAuthor(): void {
    if (this.newAuthorName.trim() === '' || this.newAuthorUuid.trim() === '') {
      console.error('New author name and UUID are required.');
      return;
    }
  
    const isNewUuidValid = !this.authors.some(author => author.uuid === this.newAuthorUuid);
  
    if (!isNewUuidValid) {
      console.error('The UUID is already taken.');
      return;
    }
  
    const newAuthor: Author = { name: this.newAuthorName, uuid: this.newAuthorUuid };
    this.bookService.createAuthor(newAuthor).subscribe(
      (response) => {
        console.log('New author added successfully:', response);
        this.newAuthorName = '';
        this.newAuthorUuid = '';
        this.loadAuthors();
      },
      (error) => {
        console.error('Error adding new author:', error);
      }
    );
  }
  
  
}
