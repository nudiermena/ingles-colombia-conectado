import jsPDF from 'jspdf';

interface CertificateData {
  id: number | string;
  level: string;
  title: string;
  description: string;
  dateEarned: string | null;
  skills: string[];
}

interface UserData {
  fullName?: string;
  email?: string;
}

export const generateCertificatePDF = (
  certificate: CertificateData,
  userData: UserData
): void => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [297, 210] // A4 landscape
  });

  // Colors
  const primaryColor = [59, 130, 246]; // Blue
  const successColor = [34, 197, 94]; // Green
  const darkColor = [30, 41, 59]; // Dark slate

  // Background gradient effect (simplified)
  doc.setFillColor(240, 247, 255);
  doc.rect(0, 0, 297, 210, 'F');

  // Border
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(2);
  doc.rect(10, 10, 277, 190);

  // Inner border
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.rect(15, 15, 267, 180);

  // Header decoration
  doc.setFillColor(...primaryColor);
  doc.roundedRect(20, 20, 257, 40, 3, 3, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICADO DE COMPLETACIÓN', 148.5, 35, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Certificate of Completion', 148.5, 48, { align: 'center' });

  // Student name - no symbol/icon to avoid encoding issues
  doc.setTextColor(...darkColor);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  const studentName = (userData.fullName || userData.email || 'Estudiante').toString();
  const nameLines = doc.splitTextToSize(studentName, 240);
  doc.text(nameLines, 148.5, 78, { align: 'center', maxWidth: 240 });

  // Description
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const description = certificate.description;
  const descriptionLines = doc.splitTextToSize(description, 240);
  doc.text(descriptionLines, 148.5, 95, { align: 'center', maxWidth: 240 });

  // Certificate title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(certificate.title, 148.5, 118, { align: 'center', maxWidth: 240 });

  // Level badge
  doc.setFillColor(...successColor);
  doc.circle(148.5, 138, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.level, 148.5, 142, { align: 'center' });

  // Skills section
  let yPos = 165;
  if (certificate.skills && certificate.skills.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text('Habilidades Adquiridas:', 148.5, yPos, { align: 'center' });
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const skillsText = certificate.skills.join(' - ');
    const skillsLines = doc.splitTextToSize(skillsText, 240);
    doc.text(skillsLines, 148.5, yPos, { align: 'center', maxWidth: 240 });
    yPos += 15;
  }

  // Date
  const dateStr = certificate.dateEarned || new Date().toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text(`Fecha de emisión: ${dateStr}`, 148.5, yPos, { align: 'center' });
  yPos += 12;

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text(
    'Este certificado está alineado con el Marco Común Europeo de Referencia (MCER)',
    148.5, yPos, { align: 'center' }
  );

  // Certificate ID
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.text(`ID: CERT-${certificate.level}-${String(certificate.id)}-${Date.now()}`, 148.5, yPos + 6, { align: 'center' });

  // Generate filename
  const filename = `Certificado_${certificate.level}_${studentName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  
  // Save PDF
  doc.save(filename);
};

