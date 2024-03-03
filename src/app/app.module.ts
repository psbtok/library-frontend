// app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookTileComponent } from './components/book-tile/book-tile.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { BookPreviewComponent } from './components/book-preview/book-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    BookTileComponent,
    SearchBarComponent,
    BookPreviewComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
