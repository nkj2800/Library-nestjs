import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/createBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: mongoose.Model<Book>) { }

  // Return the books array, which will be wrapped in a Promise because the function is async
  async getAllBooks(): Promise<Book[]> {
    const books = await this.bookModel.find()
    return books
  }

  async crateBook(book: CreateBookDto): Promise<Book> {
    const createdBook = await this.bookModel.create(book)

    return createdBook
  }

  async getABook(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id)

    if (!book) {
      throw new NotFoundException("Book not found")
    }

    return book
  }

  async updateBook(id: string, values: UpdateBookDto): Promise<Book> {
    await this.getABook(id)

    return await this.bookModel.findByIdAndUpdate(
      id,
      values,
      {
        new: true,
        runValidators: true
      }
    )
  }

  async deleteBook(id: string): Promise<Book> {
    await this.getABook(id)

    return await this.bookModel.findByIdAndDelete(id)
  }


}
