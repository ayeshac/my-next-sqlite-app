// app/api/users/route.ts (App Router - Next.js 13+)
import { PrismaClient } from '@prisma/client'
import { request } from 'http';

const prisma = new PrismaClient()

export async function GET() {
    const users = await prisma.user.findMany();
  
    return new Response(JSON.stringify(users), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  export async function POST(request: Request) {
    const body = await request.json(); // ✅ correct usage
    const { name, email } = body;
  
    const newUser = await prisma.user.create({
      data: { name, email },
    });
  
    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }
