const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const { InvoiceService } = require("../services/invoice.service");
const createQueryHelper = require("../helpers/Query.helper");

class InvoiceController {
  // Create new invoice
  createInvoice = async (req, res) => {
    const invoice = await InvoiceService.create(req.body);
    
    Response(res)
      .status(201)
      .message("Invoice created successfully")
      .body(invoice)
      .send();
  };

  // Generate invoice from appointment
  generateFromAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    
    try {
      const invoice = await InvoiceService.generateFromAppointment(appointmentId);
      
      Response(res)
        .status(201)
        .message("Invoice generated successfully")
        .body(invoice)
        .send();
    } catch (error) {
      throw new HttpError(400, error.message);
    }
  };

  // Get all invoices
  getAllInvoices = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["invoiceNumber", "patientName", "patientEmail"],
      unFilter: [],
      customFilters: (filter, query) => {
        if (query.status) filter.status = query.status;
        if (query.paymentMethod) filter.paymentMethod = query.paymentMethod;
        if (query.startDate) filter.issueDate = { $gte: new Date(query.startDate) };
        if (query.endDate) {
          filter.issueDate = { 
            ...filter.issueDate, 
            $lte: new Date(query.endDate) 
          };
        }
        if (query.minAmount) filter.total = { $gte: parseFloat(query.minAmount) };
        if (query.maxAmount) {
          filter.total = { 
            ...filter.total, 
            $lte: parseFloat(query.maxAmount) 
          };
        }
      },
    });

    const invoices = await InvoiceService.paginate(filter, options);
    Response(res).body(invoices).send();
  };

  // Get invoice by ID
  getInvoiceById = async (req, res) => {
    const { id } = req.params;
    const invoice = await InvoiceService.findById(id);
    
    if (!invoice) {
      throw new HttpError(404, "Invoice not found");
    }

    Response(res).body(invoice).send();
  };

  // Get invoice by invoice number
  getInvoiceByNumber = async (req, res) => {
    const { invoiceNumber } = req.params;
    const invoice = await InvoiceService.findByInvoiceNumber(invoiceNumber);
    
    if (!invoice) {
      throw new HttpError(404, "Invoice not found");
    }

    Response(res).body(invoice).send();
  };

  // Get invoice by appointment ID
  getInvoiceByAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const invoice = await InvoiceService.findByAppointmentId(appointmentId);
    
    if (!invoice) {
      throw new HttpError(404, "Invoice not found for this appointment");
    }

    Response(res).body(invoice).send();
  };

  // Update invoice
  updateInvoice = async (req, res) => {
    const { id } = req.params;
    const invoice = await InvoiceService.findByIdAndUpdate(id, req.body);
    
    if (!invoice) {
      throw new HttpError(404, "Invoice not found");
    }

    Response(res)
      .status(200)
      .message("Invoice updated successfully")
      .body(invoice)
      .send();
  };

  // Delete invoice
  deleteInvoice = async (req, res) => {
    const { id } = req.params;
    const invoice = await InvoiceService.findByIdAndDelete(id);
    
    if (!invoice) {
      throw new HttpError(404, "Invoice not found");
    }

    Response(res)
      .status(200)
      .message("Invoice deleted successfully")
      .send();
  };

  // Update invoice status
  updateInvoiceStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'paid', 'overdue', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new HttpError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    const invoice = await InvoiceService.updateStatus(id, status);
    
    if (!invoice) {
      throw new HttpError(404, "Invoice not found");
    }

    Response(res)
      .status(200)
      .message("Invoice status updated successfully")
      .body(invoice)
      .send();
  };

  // Mark invoice as paid
  markAsPaid = async (req, res) => {
    const { id } = req.params;
    const { paymentMethod = 'online' } = req.body;
    
    const invoice = await InvoiceService.markAsPaid(id, paymentMethod);
    
    if (!invoice) {
      throw new HttpError(404, "Invoice not found");
    }

    Response(res)
      .status(200)
      .message("Invoice marked as paid successfully")
      .body(invoice)
      .send();
  };

  // Send invoice via email
  sendInvoiceEmail = async (req, res) => {
    const { id } = req.params;
    
    try {
      const result = await InvoiceService.sendInvoiceEmail(id);
      
      Response(res)
        .status(200)
        .message(result.message)
        .body(result)
        .send();
    } catch (error) {
      throw new HttpError(400, error.message);
    }
  };

  // Get invoice statistics
  getInvoiceStatistics = async (req, res) => {
    const stats = await InvoiceService.getStatistics();
    Response(res).body(stats).send();
  };

  // Get pending invoices
  getPendingInvoices = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const invoices = await InvoiceService.paginate(
      { status: 'pending' },
      { page, limit, sort: { issueDate: -1 } }
    );
    Response(res).body(invoices).send();
  };

  // Get overdue invoices
  getOverdueInvoices = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const today = new Date();
    const invoices = await InvoiceService.paginate(
      { 
        status: 'pending',
        dueDate: { $lt: today }
      },
      { page, limit, sort: { dueDate: 1 } }
    );
    Response(res).body(invoices).send();
  };

  // Get paid invoices
  getPaidInvoices = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const invoices = await InvoiceService.paginate(
      { status: 'paid' },
      { page, limit, sort: { paymentDate: -1 } }
    );
    Response(res).body(invoices).send();
  };

  // Get recent invoices
  getRecentInvoices = async (req, res) => {
    const { limit = 10 } = req.query;
    const invoices = await InvoiceService.paginate(
      {},
      { 
        page: 1, 
        limit: parseInt(limit), 
        sort: { createdAt: -1 } 
      }
    );
    Response(res).body(invoices).send();
  };
}

module.exports = { InvoiceController: new InvoiceController() };
