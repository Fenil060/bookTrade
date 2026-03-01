import Book from "../models/Book.js";
import cloudinary from "../config/cloudinary.js";

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ status: "available" })
      .sort({ createdAt: -1 });

    res.json({ books });
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const createBook = async (req, res) => {
  try {
    console.log("Uploading to Cloudinary...");
    const { title, author, price, condition, description } = req.body;

    if (!title || !author || !price || !condition) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "bookTrade"
        });

        imageUrls.push(result.secure_url);
      }
    }

    const book = await Book.create({
      title,
      author,
      price,
      condition,
      description,
      images: imageUrls,
      ownerId: req.user._id
    });

    res.status(201).json(book);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editBook = async(req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // only owner
    if (book.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // only available books can be edited
    if (book.status !== "available") {
      return res.status(400).json({
        message: "Book cannot be edited after request"
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (book.status !== "available") {
      return res.status(400).json({
        message: "Book cannot be deleted after request"
      });
    }

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// export const getMyBooks = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const books = await Book.find({ ownerId: userId })
//       .sort({ createdAt: -1 });

//     res.json({ count: books.length, books });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// Get details of a single book
export const getBookById = async (req, res) => {
    try {
        const bookId = req.params.id;
        
        // Find book by ID
        const book = await Book.findById(bookId)
            .populate('ownerId', 'name email avatar'); // optional: populate owner details

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(book);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



