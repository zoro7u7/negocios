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
  const totalsX = 140;
  const valueX = 185;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Subtotal:`, totalsX, finalY);
  doc.text(`$${data.subtotal.toFixed(2)}`, valueX, finalY, { align: 'right' });

  if (data.ivaAmount > 0) {
    doc.text(`IVA (${data.ivaRateSnapshot}%):`, totalsX, finalY + 7);
    doc.text(`$${data.ivaAmount.toFixed(2)}`, valueX, finalY + 7, { align: 'right' });
  }

  if (data.discount > 0) {
    doc.setTextColor(220, 50, 50);
    doc.text(`Descuento:`, totalsX, finalY + 14);
    doc.text(`-$${data.discount.toFixed(2)}`, valueX, finalY + 14, { align: 'right' });
  }

  const mainTotalY = finalY + 24;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL USD:`, totalsX, mainTotalY);
  doc.text(`$${data.totalUsd.toFixed(2)}`, valueX, mainTotalY, { align: 'right' });

  const bsTotalY = mainTotalY + 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Referencia Bs. (Tasa: ${data.bcvRateSnapshot.toFixed(2)}):`, totalsX, bsTotalY);
  doc.setFont("helvetica", "bold");
  doc.text(`${data.totalBs.toFixed(2)} Bs.`, valueX, bsTotalY, { align: 'right' });

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text("Esta factura es una representación del total en USD pagadero en Bs. a la tasa indicada.", 105, 275, { align: 'center' });
  doc.text("Gracias por su preferencia.", 105, 282, { align: 'center' });

  doc.save(`factura_${data.invoiceId}.pdf`);
};

