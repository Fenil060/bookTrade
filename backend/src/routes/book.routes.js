import express from "express";
import {createBook,getAllBooks, editBook, deleteBook, getBookById} from "../controllers/book.controller.js";
import protect from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";


const router = express.Router();

router.get("/allbook", getAllBooks); //home
router.get('/:id', getBookById); //single book
// router.get("/my", protect, getMyBooks); //my books profile

router.post("/addBook", protect, upload.array("images", 3), createBook);
router.put("/:id", protect, editBook); //edit my book
router.delete("/:id", protect, deleteBook); // delete my book

export default router;
