import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generateInvoicePDF = (data: any) => {
  const doc = new jsPDF() as any;
  const margin = 20;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text("RECIBO DE VENTA", margin, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Nro. Factura: #${data.invoiceId}`, 150, 30);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 35);

  // Line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, 45, 190, 45);

  // Client Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("CLIENTE:", margin, 60);
  doc.setFont("helvetica", "bold");
  doc.text(data.clientName, margin + 25, 60);
  doc.setFont("helvetica", "normal");
  if (data.clientPhone) doc.text(`Telf: ${data.clientPhone}`, margin, 67);

  // Table
  const tableRows = data.items.map((item: any) => [
    item.name,
    item.quantity,
    `$${item.price.toFixed(2)}`,
    `$${(item.price * item.quantity).toFixed(2)}`
  ]);

  doc.autoTable({
    startY: 80,
    head: [['Descripción', 'Cant.', 'Precio Unit.', 'Subtotal']],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: margin, right: margin }
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // Totals
  doc.setFontSize(10);
  doc.text(`Subtotal:`, 140, finalY);
  doc.text(`$${data.subtotal.toFixed(2)}`, 170, finalY, { align: 'right' });

  if (data.ivaAmount > 0) {
    doc.text(`IVA (16%):`, 140, finalY + 7);
    doc.text(`$${data.ivaAmount.toFixed(2)}`, 170, finalY + 7, { align: 'right' });
  }

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL USD:`, 140, finalY + 17);
  doc.text(`$${data.totalUsd.toFixed(2)}`, 170, finalY + 17, { align: 'right' });

  doc.setFontSize(12);
  doc.text(`TOTAL BS:`, 140, finalY + 25);
  doc.text(`Bs ${(data.totalUsd * data.bcvRate).toFixed(2)}`, 170, finalY + 25, { align: 'right' });

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text("Gracias por su preferencia.", 105, 280, { align: 'center' });

  doc.save(`factura_${data.invoiceId}.pdf`);
};
