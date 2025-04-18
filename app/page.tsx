'use client'


import Image from "next/image";
import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Book } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  // const [books, setBooks] = useState([]);
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['books'],
    queryFn: () => fetch('/api/books').then(res => res.json()),
  });

  // const fetchBooks = async () => {
  //   const res = await fetch('/api/books');
  //   const data = await res.json();
  //   setBooks(data);
  // };

  // useEffect(() => {
  //   fetchBooks(); // 🟢 Load initial data
  // }, []);

  type BookPayload = {
    name: string;
    author: string;
    description: string;
  };


  const mutation = useMutation({
    mutationFn: (newBook: BookPayload) =>
      fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] }); // 🟢 Triggers refetch
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    mutation.mutate({ name, author, description });
    setName('')
    setAuthor('')
    setDescription('')
  }
  return (
    <div className="grid grid-rows-[20px_40px_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-65 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full h-[10rem] bg-blue-300/25 font-bold text-center flex items-center justify-center">
        <h1>Books Directory</h1>
      </header>
      <main className="flex flex-col gap-[30px] row-start-2 items-center sm:items-start">
        <form onSubmit={handleSubmit} className="mx-8">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
          <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author" />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
          <Button type="submit">Add Book</Button>
        </form>
        <div className="mx-5"><Table>

          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Book Name</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="text-right">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((Row: Book) => {
              return <TableRow>
                <TableCell className="font-medium">{Row.id}</TableCell>
                <TableCell>{Row.name}</TableCell>
                <TableCell>{Row.author}</TableCell>
                <TableCell className="text-right">{Row.description}</TableCell>
              </TableRow>
            })}

          </TableBody>
        </Table>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center bg-amber-200 w-full h-36 font-bold">
        <h1>Made with love from Ayesha </h1>
      </footer>
    </div>
  );
}
