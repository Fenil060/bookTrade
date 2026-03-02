import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";
import "./styles/book.css";
import BookDetail from "./pages/bookdetail";
import Header from "./component/header";
import ProfileLayout from "./pages/Profile/profileLayout";
import PrivateRoute from "./component/privateRoute";
import MyBooks from "./pages/Profile/myBook";
import AddBook from "./pages/addBook";
import EditBook from "./pages/editBook";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<PrivateRoute><ProfileLayout /></PrivateRoute>}>
          <Route path="my-books" element={<MyBooks />} />
        </Route>
        <Route path="/addBook" element={<AddBook />} />
        <Route path="/edit-book/:id" element={<PrivateRoute> <EditBook /> </PrivateRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

