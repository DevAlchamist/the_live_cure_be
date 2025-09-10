const { sendMail } = require("../helpers/Mail.helper");

class InvoiceEmailService {
  // Send invoice email directly from appointment data
  sendInvoiceFromAppointment = async (appointment) => {
    const invoiceData = this.prepareInvoiceData(appointment);
    const htmlTemplate = this.generateInvoiceHTML(invoiceData);
    
    const mailOptions = {
      to: appointment.patientEmail,
      subject: `Invoice ${invoiceData.invoiceNumber} - The Live Cure`,
      html: htmlTemplate
    };

    try {
      await sendMail(mailOptions);
      console.log(`Invoice email sent successfully to ${appointment.patientEmail}`);
      return { success: true, message: 'Invoice sent successfully' };
    } catch (error) {
      console.error(`Failed to send invoice email: ${error.message}`);
      throw new Error(`Failed to send invoice email: ${error.message}`);
    }
  };

  // Prepare invoice data from appointment
  prepareInvoiceData = (appointment) => {
    // Generate invoice number
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const invoiceNumber = `INV-${year}${month}${day}-${randomNum}`;

    // Calculate fees
    const consultationFee = appointment.consultationFees || 150.00;
    const platformFee = Math.round(consultationFee * 0.1); // 10% platform fee
    const tax = Math.round((consultationFee + platformFee) * 0.11); // 11% tax
    const discount = 0;
    const subtotal = consultationFee + platformFee - discount;
    const total = subtotal + tax;

    // Calculate due date (30 days from today)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    return {
      invoiceNumber,
      patientName: appointment.patientName,
      patientEmail: appointment.patientEmail,
      patientPhone: appointment.patientMobile,
      patientAddress: appointment.patientAddress || '',
      consultationType: appointment.treatmentType || 'General Consultation',
      doctorName: appointment.doctorName || 'Dr. Healthcare Provider',
      appointmentDate: appointment.preferredDate || appointment.appointmentDate || new Date(),
      appointmentTime: appointment.preferredTime || '10:00 AM',
      consultationFee,
      platformFee,
      tax,
      discount,
      subtotal,
      total,
      issueDate: new Date(),
      dueDate,
      notes: appointment.notes || ''
    };
  };

  // Generate HTML template for invoice email
  generateInvoiceHTML = (invoiceData) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoiceData.invoiceNumber}</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background-color: #f8fafc; 
            }
            .container { 
                max-width: 800px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 12px; 
                overflow: hidden; 
                box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #3b82f6, #10b981); 
                color: white; 
                padding: 30px; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 28px; 
                font-weight: bold; 
            }
            .header p { 
                margin: 5px 0 0 0; 
                opacity: 0.9; 
            }
            .invoice-number { 
                background: rgba(255,255,255,0.2); 
                padding: 10px 20px; 
                border-radius: 8px; 
                text-align: center; 
                margin-top: 20px; 
            }
            .content { 
                padding: 30px; 
            }
            .section { 
                margin-bottom: 30px; 
            }
            .section h3 { 
                color: #374151; 
                margin-bottom: 15px; 
                font-size: 18px; 
                border-bottom: 2px solid #e5e7eb; 
                padding-bottom: 8px; 
            }
            .grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 30px; 
            }
            .info-item { 
                margin-bottom: 10px; 
            }
            .info-label { 
                font-weight: 600; 
                color: #6b7280; 
            }
            .info-value { 
                color: #111827; 
            }
            .table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0; 
            }
            .table th, .table td { 
                padding: 12px; 
                text-align: left; 
                border-bottom: 1px solid #e5e7eb; 
            }
            .table th { 
                background-color: #f9fafb; 
                font-weight: 600; 
                color: #374151; 
            }
            .table .text-right { 
                text-align: right; 
            }
            .total-section { 
                background-color: #f9fafb; 
                padding: 20px; 
                border-radius: 8px; 
                margin-top: 20px; 
            }
            .total-row { 
                display: flex; 
                justify-content: space-between; 
                margin-bottom: 10px; 
            }
            .total-row.final { 
                font-weight: bold; 
                font-size: 18px; 
                color: #111827; 
                border-top: 2px solid #e5e7eb; 
                padding-top: 10px; 
            }
            .status { 
                display: inline-block; 
                padding: 6px 12px; 
                border-radius: 20px; 
                font-size: 12px; 
                font-weight: 600; 
                background-color: #fef3c7; 
                color: #92400e; 
            }
            .footer { 
                background: linear-gradient(135deg, #3b82f6, #10b981); 
                color: white; 
                padding: 20px; 
                text-align: center; 
            }
            .footer p { 
                margin: 5px 0; 
                opacity: 0.9; 
            }
            .button { 
                display: inline-block; 
                background-color: #3b82f6; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 6px; 
                font-weight: 600; 
                margin: 10px; 
            }
            .button:hover { 
                background-color: #2563eb; 
            }
            @media (max-width: 600px) {
                .grid { 
                    grid-template-columns: 1fr; 
                    gap: 20px; 
                }
                .container { 
                    margin: 10px; 
                }
                .content { 
                    padding: 20px; 
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💙 The Live Cure</h1>
                <p>Healthcare Excellence</p>
                <div class="invoice-number">
                    <p style="margin: 0; font-size: 14px; opacity: 0.9;">Invoice</p>
                    <p style="margin: 0; font-size: 20px; font-weight: bold;">${invoiceData.invoiceNumber}</p>
                </div>
            </div>
            
            <div class="content">
                <div class="section">
                    <div class="grid">
                        <div>
                            <h3>📍 Billing Address</h3>
                            <div class="info-item">
                                <div class="info-label">The Live Cure Medical Center</div>
                                <div class="info-value">123 Health Street, Medical District</div>
                                <div class="info-value">New York, NY 10001</div>
                                <div class="info-value">📞 +1 (555) 123-CURE</div>
                                <div class="info-value">✉️ billing@thelivecure.com</div>
                            </div>
                        </div>
                        <div>
                            <h3>📅 Invoice Details</h3>
                            <div class="info-item">
                                <div class="info-label">Issue Date:</div>
                                <div class="info-value">${new Date(invoiceData.issueDate).toLocaleDateString()}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Due Date:</div>
                                <div class="info-value">${new Date(invoiceData.dueDate).toLocaleDateString()}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Status:</div>
                                <div class="info-value">
                                    <span class="status">Pending Payment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3>👤 Patient Information</h3>
                    <div class="grid">
                        <div>
                            <div class="info-item">
                                <div class="info-label">Full Name:</div>
                                <div class="info-value">${invoiceData.patientName}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Email:</div>
                                <div class="info-value">${invoiceData.patientEmail}</div>
                            </div>
                        </div>
                        <div>
                            <div class="info-item">
                                <div class="info-label">Phone:</div>
                                <div class="info-value">${invoiceData.patientPhone}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Address:</div>
                                <div class="info-value">${invoiceData.patientAddress || 'Not provided'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3>🩺 Consultation Details</h3>
                    <div class="grid">
                        <div>
                            <div class="info-item">
                                <div class="info-label">Consultation Type:</div>
                                <div class="info-value">${invoiceData.consultationType}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Healthcare Provider:</div>
                                <div class="info-value">${invoiceData.doctorName}</div>
                            </div>
                        </div>
                        <div>
                            <div class="info-item">
                                <div class="info-label">Appointment Date:</div>
                                <div class="info-value">${new Date(invoiceData.appointmentDate).toLocaleDateString()}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Appointment Time:</div>
                                <div class="info-value">${invoiceData.appointmentTime}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3>💰 Payment Details</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th class="text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Consultation Fee</td>
                                <td class="text-right">$${invoiceData.consultationFee.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Platform Fee</td>
                                <td class="text-right">$${invoiceData.platformFee.toFixed(2)}</td>
                            </tr>
                            ${invoiceData.discount > 0 ? `
                            <tr>
                                <td>Discount</td>
                                <td class="text-right">-$${invoiceData.discount.toFixed(2)}</td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td>Tax</td>
                                <td class="text-right">$${invoiceData.tax.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div class="total-section">
                        <div class="total-row">
                            <span>Subtotal:</span>
                            <span>$${invoiceData.subtotal.toFixed(2)}</span>
                        </div>
                        <div class="total-row final">
                            <span>Total Amount:</span>
                            <span>$${invoiceData.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                ${invoiceData.notes ? `
                <div class="section">
                    <h3>📝 Notes</h3>
                    <p>${invoiceData.notes}</p>
                </div>
                ` : ''}

                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" class="button">💳 Pay Now</a>
                    <a href="#" class="button" style="background-color: #10b981;">📄 Download PDF</a>
                </div>
            </div>

            <div class="footer">
                <p><strong>🔒 Secure Payment</strong> - All transactions are encrypted and secure</p>
                <p><strong>✅ Licensed Professionals</strong> - Certified healthcare providers</p>
                <p><strong>🕐 24/7 Support</strong> - Always here when you need us</p>
                <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.3); margin: 20px 0;">
                <p>&copy; 2025 The Live Cure. All rights reserved.</p>
                <p>Payment due within 30 days of invoice date.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  };
}

module.exports = { InvoiceEmailService: new InvoiceEmailService() };
