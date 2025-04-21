// app/api/users/route.ts (App Router - Next.js 13+)
import { PrismaClient } from '@prisma/client'
import { request } from 'http';

const prisma = new PrismaClient()

// export async function GET() {
//     const books = await prisma.book.findMany();
  
//     return new Response(JSON.stringify(books), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   export async function POST(request: Request) {
//     const body = await request.json(); // ✅ correct usage
//     const { id,name, author, description } = body;
  
//     const newBook = await prisma.book.create({
//       data: { id,name, author, description  },
//     });
  
//     return new Response(JSON.stringify(newBook), {
//       status: 201,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
