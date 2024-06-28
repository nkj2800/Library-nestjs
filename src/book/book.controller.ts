import { Body, Controller, Delete, Get, HttpException, Param, Post, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/createBook.dto';
import mongoose from 'mongoose';
import { UpdateBookDto } from './dto/updateBook.dto';

@Controller('book')
export class BookController {

  constructor(private readonly bookService: BookService) { }

  @Get()
  async getAllBooks(): Promise<Book[]> {

    return this.bookService.getAllBooks()
  }

  @Post()
  async createBook(@Body() book: CreateBookDto): Promise<Book> {

    return this.bookService.crateBook(book)
  }

  @Get(':id')
  async getABook(@Param('id') id: string): Promise<Book> {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException("Invalid id", 400)
    }

    return this.bookService.getABook(id)
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() values: UpdateBookDto
  ): Promise<Book> {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException("Invalid id", 400)
    }

    return this.bookService.updateBook(id, values)
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string): Promise<Book> {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException("Invalid id", 400)
    }

    return this.bookService.deleteBook(id)
  }
}
