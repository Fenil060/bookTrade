import Request from "../models/Request.js";
import Book from "../models/Book.js";

export const requestBook = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.bookId,
      status: "available",
      activeRequest: null
    });

    if (!book) {
      return res.status(400).json({
        message: "Book is not available or already requested"
      });
    }

    // cannot request own book
    if (book.ownerId.toString() === req.user.id) {
      return res.status(400).json({
        message: "You cannot request your own book"
      });
    }

    const request = await Request.create({
      buyerId: req.user.id,
      sellerId: book.ownerId,
      bookId: book._id,
      status: "pending"
    });

    book.status = "requested";
    book.activeRequest = request._id;
    await book.save();

    res.status(201).json({
      message: "Request sent successfully",
      request
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("bookId");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // only seller
    if (request.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already resolved" });
    }

    request.status = "approved";
    await request.save();

    request.bookId.status = "approved";
    await request.bookId.save();

    res.json({ message: "Request approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("bookId");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already resolved" });
    }

    request.status = "cancelled";
    await request.save();

    request.bookId.status = "available";
    request.bookId.activeRequest = null;
    await request.bookId.save();

    res.json({ message: "Request rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const cancelRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("bookId");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // only buyer
    if (request.buyerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already resolved" });
    }

    request.status = "cancelled";
    await request.save();

    request.bookId.status = "available";
    request.bookId.activeRequest = null;
    await request.bookId.save();

    res.json({ message: "Request cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const choosePaymentMode = async (req, res) => {
  const { paymentMode } = req.body;
  const { id } = req.params; // requestId
  const userId = req.user.id;

  const request = await Request.findById(id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  if (request.buyerId.toString() !== userId)
    return res.status(403).json({ message: "Not authorized" });

  if (request.status !== "approved")
    return res.status(400).json({ message: "Payment mode can only be chosen after approval" });

  if (!["online", "offline"].includes(paymentMode))
    return res.status(400).json({ message: "Invalid payment mode" });

  request.paymentMode = paymentMode;
  await request.save();

  res.json({ message: "Payment mode selected", paymentMode });
};


export const markPaid = async (req, res) => {
  const { id } = req.params; // requestId
  const userId = req.user.id;

  const request = await Request.findById(id).populate("bookId");
  if (!request) return res.status(404).json({ message: "Request not found" });

  if (request.sellerId.toString() !== userId)
    return res.status(403).json({ message: "Not authorized" });

  if (request.status !== "approved")
    return res.status(400).json({ message: "Cannot mark paid before approval" });

  if (!request.paymentMode)
    return res.status(400).json({ message: "Buyer has not chosen payment mode yet" });

  // Update request and book
  request.status = "paid";
  await request.save();

  const book = await Book.findById(request.bookId._id);
  book.status = "sold";
  book.activeRequest = null;
  await book.save();

  res.json({ message: "Payment received, book marked as sold" });
};

// Requests received as seller
export const getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await Request.find({ sellerId: userId })
      .populate("bookId", "title author price condition status")
      .populate("buyerId", "name email")
      .sort({ createdAt: -1 });

    res.json({ count: requests.length, requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Requests sent as buyer
export const getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await Request.find({ buyerId: userId })
      .populate("bookId", "title author price condition status")
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 });

    res.json({ count: requests.length, requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


