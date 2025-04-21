// app/actions/bookActions.ts (or wherever you keep your logic)
'use server';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function addBook({
  name,
  author,
  description,
}: {
  name: string;
  author: string;
  description: string;
}) {
  await prisma.book.create({
    data: { name, author, description },
  });
}

export async function getBooks() {
    const books = await prisma.book.findMany();
    return books; // return all books from the database
  }
