import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";
import "./styles/book.css";
import BookDetail from "./pages/bookdetail";
import Header from "./component/header";
import Footer from "./component/footer";
import ProfileLayout from "./pages/Profile/profileLayout";
import PrivateRoute from "./component/privateRoute";
import MyBooks from "./pages/Profile/myBook";
import AddBook from "./pages/addBook";
import EditBook from "./pages/editBook";
import RequestsSent from "./pages/Profile/requestSend";
import RequestsReceived from "./pages/Profile/requestReceived";
import ProfileChats from "./pages/Profile/profileChats";
import ChangePhone from "./pages/Profile/updatePhone";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfileLayout />}>
          <Route path="my-books" element={<MyBooks />} />
          <Route path="requests-received" element={<RequestsReceived />} />
          <Route path="requests-sent" element={<RequestsSent />} />
          <Route path="chats" element={<ProfileChats />} />
          <Route path="change-number" element={<ChangePhone />} />
        </Route>
        <Route path="/addBook" element={<PrivateRoute><AddBook /></PrivateRoute>} />
        <Route path="/edit-book/:id" element={<PrivateRoute> <EditBook /> </PrivateRoute>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

