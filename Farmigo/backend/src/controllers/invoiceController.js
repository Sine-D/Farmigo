// controllers/invoiceController.js

const PDFDocument = require('pdfkit');
const Order = require('../models/makeOrderModel');
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');

// Generate invoice PDF for an order
exports.generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('buyerId', 'name email')
      .populate('farmerId', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (
      req.user._id.toString() !== order.buyerId._id.toString() &&
      req.user._id.toString() !== order.farmerId._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create a PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice_${order._id}.pdf`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();

    // Order info
    doc.fontSize(12).text(`Invoice ID: ${order._id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown();

    // Buyer info
    doc.text('Buyer Information:', { underline: true });
    doc.text(`Name: ${order.buyerId.name}`);
    doc.text(`Email: ${order.buyerId.email}`);
    doc.moveDown();

    // Farmer info
    doc.text('Farmer Information:', { underline: true });
    doc.text(`Name: ${order.farmerId.name}`);
    doc.text(`Email: ${order.farmerId.email}`);
    doc.moveDown();

    // Items
    doc.text('Order Items:', { underline: true });
    order.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} - ${item.quantity} x ${item.price} = ${
          item.quantity * item.price
        }`
      );
    });
    doc.moveDown();

    // Total
    doc.text(`Subtotal: ${order.totalAmount - (order.taxPrice + order.shippingPrice)}`);
    doc.text(`Tax: ${order.taxPrice}`);
    doc.text(`Shipping: ${order.shippingPrice}`);
    doc.fontSize(14).text(`Total: ${order.totalAmount}`, { bold: true });
    doc.moveDown();

    // Footer
    doc.fontSize(10).text('Thank you for your order!', { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};