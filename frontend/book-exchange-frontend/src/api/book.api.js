import { clientServer } from "./client";


export const getAvailableBooks = async () => {
  const res = await clientServer.get("/api/books/allbook");
  return res.data.books;
};

export const getBookById = async (id) => {
  const res = await clientServer.get(`/api/books/${id}`);
  return res.data;
};

export const deleteBook = async (id) => {
  const res = await clientServer.delete(`/api/books/${id}`);
  return res.data;
}

export const addBook = async (bookData) => {
  const res = await clientServer.post(
    "/api/books/addBook",
    bookData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return res.data;
};

export const editBook = async (id, bookData) => {
  const res = await clientServer.put( `/api/books/${id}`, bookData,);
  return res.data;
};