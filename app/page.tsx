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
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Book } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addBook, getBooks } from '@/app/actions/bookAction';
export default function Home() {
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  // const [books, setBooks] = useState<BookPayloadWithId[]>([]);
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const router = useRouter();

  type BookPayloadWithId = {
    id: number;
    name: string;
    author: string;
    description: string;
  };


  const records = parseInt(searchParams.get('records') || '5', 10);

  useEffect(() => {
    // When the component mounts or refreshes, the query param should be read and reflected
    if (searchParams.get('records')) {
      router.push(`/?records=${records}`);
    }
  }, [records, searchParams, router]);



  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  })

  // ✅ Add book mutation
  const mutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      // ✅ This triggers refetch of books
      queryClient.invalidateQueries({ queryKey: ['books'] })
      setName('')
      setAuthor('')
      setDescription('')
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Avoid submitting if a mutation is already in progress
    if (mutation.isPending) return

    mutation.mutate({
      name,
      author,
      description,
    })
  }


  const handleShowRecords = (num: number) => {
    router.push(`/?records=${num}`);
  };


  return (
    <div className="flex flex-col min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="h-[10rem] bg-blue-300/25 font-bold text-center flex items-center justify-center">
        <h1>Books Directory</h1>
      </header>
      <main className="flex-1 flex flex-col gap-[30px] items-center  my-10">
        <form onSubmit={handleSubmit} className="mx-8">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
          <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author" />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
          <Button type="submit">Add Book</Button>
        </form>
        <div className="flex gap-4 mx-8">
          <Button onClick={() => handleShowRecords(5)} variant={records === 5 ? "default" : "outline"}
            disabled={records === 5}>Show 5 Rows</Button>
          <Button onClick={() => handleShowRecords(10)} variant={records === 10 ? "default" : "outline"}
            disabled={records === 10}>Show 10 Rows</Button>
        </div>

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
            {books?.slice(0, records).map((Row: BookPayloadWithId, index: number) => {
              return <TableRow>
                <TableCell className="font-medium">{index+1}</TableCell>
                <TableCell>{Row.name}</TableCell>
                <TableCell>{Row.author}</TableCell>
                <TableCell className="text-right">{Row.description}</TableCell>
              </TableRow>
            })}

          </TableBody>
        </Table>
        </div>
      </main>
      <footer className="flex gap-[54px] flex-wrap items-center justify-center bg-amber-200 w-full h-36 font-bold">
        <h1>Made with love from Ayesha </h1>
      </footer>
    </div>
  );
}
