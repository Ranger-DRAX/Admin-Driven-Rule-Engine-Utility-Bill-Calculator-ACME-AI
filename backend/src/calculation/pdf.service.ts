import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { CalculationResultDto } from './dto/calculation-result.dto';

/**
 * Service for generating PDF bills
 * Creates simple, readable electricity bills matching the web interface
 */
@Injectable()
export class PdfService {
  generateBillPdf(result: CalculationResultDto): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });
        doc.on('error', reject);

        const pageWidth = 595.28;
        const margin = 50;
        const contentWidth = pageWidth - (margin * 2);

        // Company Header
        doc.fontSize(24)
          .font('Helvetica-Bold')
          .fillColor('#2563eb')
          .text('ACME ELECTRICITY', margin, margin, { align: 'center', width: contentWidth });

        doc.fontSize(11)
          .font('Helvetica')
          .fillColor('#6b7280')
          .text('Power Distribution Services', margin, margin + 30, { align: 'center', width: contentWidth });

        let yPos = margin + 60;

        // Bill Title
        doc.fontSize(18)
          .font('Helvetica-Bold')
          .fillColor('#000000')
          .text('ELECTRICITY BILL', margin, yPos, { align: 'center', width: contentWidth });

        yPos += 35;

        // Date and Month
        doc.fontSize(10)
          .font('Helvetica')
          .fillColor('#374151')
          .text(`Bill Month: ${result.calculationMonth}`, margin, yPos)
          .text(`Bill Date: ${new Date(result.calculationDate).toLocaleDateString('en-GB')}`, pageWidth - margin - 150, yPos, { width: 150, align: 'right' });

        yPos += 35;

        // Consumption Box
        doc.roundedRect(margin, yPos, contentWidth, 70, 5)
          .fillAndStroke('#eff6ff', '#93c5fd');

        doc.fontSize(11)
          .font('Helvetica')
          .fillColor('#1e40af')
          .text('Total Consumption', margin + 20, yPos + 15);

        doc.fontSize(32)
          .font('Helvetica-Bold')
          .fillColor('#2563eb')
          .text(`${result.unitsConsumed} kWh`, margin + 20, yPos + 35);

        yPos += 90;

        // Bill Breakdown
        doc.fontSize(14)
          .font('Helvetica-Bold')
          .fillColor('#000000')
          .text('Bill Summary', margin, yPos);

        yPos += 25;

        // Line separator
        doc.moveTo(margin, yPos)
          .lineTo(pageWidth - margin, yPos)
          .strokeColor('#e5e7eb')
          .stroke();

        yPos += 20;

        // Base Charge
        const ratePerUnit = result.tierBreakdown[0]?.ratePerUnit || 0;
        doc.fontSize(10)
          .font('Helvetica')
          .fillColor('#6b7280')
          .text(`Base Charge (${result.unitsConsumed} kWh x Tk ${ratePerUnit.toFixed(3)})`, margin, yPos);

        doc.font('Helvetica-Bold')
          .fillColor('#000000')
          .text(`Tk ${result.baseAmount.toFixed(2)}`, pageWidth - margin - 100, yPos, { width: 100, align: 'right' });

        yPos += 25;

        // VAT
        if (result.taxes && result.taxes.length > 0) {
          const tax = result.taxes[0];
          doc.font('Helvetica')
            .fillColor('#6b7280')
            .text(`${tax.name} (${tax.value}%)`, margin, yPos);

          doc.font('Helvetica-Bold')
            .fillColor('#000000')
            .text(`Tk ${tax.amount.toFixed(2)}`, pageWidth - margin - 100, yPos, { width: 100, align: 'right' });

          yPos += 25;
        }

        // Service Charge
        if (result.surcharges && result.surcharges.length > 0) {
          const surcharge = result.surcharges[0];
          doc.font('Helvetica')
            .fillColor('#6b7280')
            .text(surcharge.name, margin, yPos);

          doc.font('Helvetica-Bold')
            .fillColor('#000000')
            .text(`Tk ${surcharge.amount.toFixed(2)}`, pageWidth - margin - 100, yPos, { width: 100, align: 'right' });

          yPos += 25;
        }

        // Separator
        yPos += 10;
        doc.moveTo(margin, yPos)
          .lineTo(pageWidth - margin, yPos)
          .strokeColor('#e5e7eb')
          .stroke();

        yPos += 20;

        // Total Amount
        doc.roundedRect(margin, yPos, contentWidth, 50, 5)
          .fillAndStroke('#eff6ff', '#2563eb');

        doc.fontSize(14)
          .font('Helvetica-Bold')
          .fillColor('#1e40af')
          .text('Total Amount', margin + 20, yPos + 17);

        doc.fontSize(20)
          .fillColor('#2563eb')
          .text(`Tk ${result.totalAmount.toFixed(2)}`, pageWidth - margin - 130, yPos + 15, { width: 120, align: 'right' });

        yPos += 70;

        // Payment Instructions
        doc.fontSize(11)
          .font('Helvetica-Bold')
          .fillColor('#000000')
          .text('Payment Information', margin, yPos);

        yPos += 18;

        doc.fontSize(9)
          .font('Helvetica')
          .fillColor('#6b7280')
          .text('• Please pay within 15 days from bill date', margin, yPos);
        yPos += 14;
        doc.text('• Keep your reference number for payment tracking', margin, yPos);
        yPos += 14;
        doc.text('• For queries: support@acme-electricity.com', margin, yPos);

        yPos += 40;

        // Footer
        doc.fontSize(8)
          .fillColor('#9ca3af')
          .text('This is a computer-generated bill. Thank you for using ACME Electricity.', margin, yPos, {
            align: 'center',
            width: contentWidth
          });

        // Finalize the PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
