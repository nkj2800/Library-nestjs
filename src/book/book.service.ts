import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/createBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { Query } from 'express-serve-static-core'

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: mongoose.Model<Book>) { }

  // Return the books array, which will be wrapped in a Promise because the function is async
  async getAllBooks(query: Query): Promise<Book[]> {
    const resultsPerPage = 5
    const currentPage = Number(query.page) || 1
    const skip = resultsPerPage * (currentPage - 1)
    const keyword = query.keyword ?
      {
        title: {
          $regex: query.keyword,
          $options: 'i'
        }
      } :
      {}

    const books = await this.bookModel
      .find({ ...keyword })
      .skip(skip)
      .limit(resultsPerPage)

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
