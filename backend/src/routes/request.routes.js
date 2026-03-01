import express from "express";
import { requestBook, approveRequest, rejectRequest, cancelRequest, choosePaymentMode, markPaid, getReceivedRequests, getSentRequests } from "../controllers/request.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/received", protect, getReceivedRequests);
router.get("/sent", protect, getSentRequests);
router.post("/:bookId", protect, requestBook);
router.put("/:id/approve", protect, approveRequest);
router.put("/:id/reject", protect, rejectRequest);
router.put("/:id/cancel", protect, cancelRequest);
router.put("/:id/payment-mode", protect, choosePaymentMode);
router.put("/:id/mark-paid", protect, markPaid);


export default router;
