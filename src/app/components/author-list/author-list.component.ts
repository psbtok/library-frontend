import { Component, OnInit } from '@angular/core';
import { Author } from '../../models/author.model';
import { DbService } from '../../services/db';

@Component({
  selector: 'app-author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.scss'],
})
export class AuthorListComponent implements OnInit {
  authors: Author[] = [];
  newAuthorName = '';
  newAuthorUuid = '';

  constructor(private dbService: DbService) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  async loadAuthors(): Promise<void> {
    try {
      const authorsFromDb = await this.dbService.authors.toArray();
      this.authors = authorsFromDb.map(author => ({
        ...author,
        updatedUuid: author.uuid,
        updatedName: author.name
      }));
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  }
  

  async confirmEdit(author: Author): Promise<void> {
    const updatedUuid = author.updatedUuid;
    const updatedName = author.updatedName;
  
    if (!updatedUuid || !updatedName) {
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
      
      try {
        await this.dbService.authors.put({ uuid: updatedUuid, name: updatedName });
        console.log('Author updated successfully');
        author.editMode = false;
      } catch (error) {
        console.error('Error updating author:', error);
      }
    }
  }    

  cancelEdit(author: Author): void {
    author.editMode = false;
    author.updatedName = author.name;
    author.updatedUuid = author.uuid;
  }

  async addNewAuthor(): Promise<void> {
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
    try {
      // Add the new author to the database
      await this.dbService.authors.put(newAuthor);
      console.log('New author added successfully');
      this.newAuthorName = '';
      this.newAuthorUuid = '';
      await this.loadAuthors();
    } catch (error) {
      console.error('Error adding new author:', error);
    }
  } 

  toggleEditMode(author: Author): void {
    author.editMode = !author.editMode;
  }
}
