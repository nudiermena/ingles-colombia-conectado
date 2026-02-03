import jsPDF from 'jspdf';

interface CertificateData {
  id: number;
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

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Certificate of Completion', 148.5, 50, { align: 'center' });

  // Award icon (represented as text)
  doc.setTextColor(...successColor);
  doc.setFontSize(48);
  doc.text('✓', 148.5, 75, { align: 'center' });

  // Student name
  doc.setTextColor(...darkColor);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  const studentName = userData.fullName || userData.email || 'Estudiante';
  doc.text(studentName, 148.5, 95, { align: 'center', maxWidth: 250 });

  // Description
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const description = certificate.description;
  const descriptionLines = doc.splitTextToSize(description, 250);
  doc.text(descriptionLines, 148.5, 110, { align: 'center', maxWidth: 250 });

  // Certificate details
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(certificate.title, 148.5, 130, { align: 'center', maxWidth: 250 });

  // Level badge
  doc.setFillColor(...successColor);
  doc.circle(148.5, 150, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.level, 148.5, 154, { align: 'center' });

  // Skills section
  if (certificate.skills && certificate.skills.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text('Habilidades Adquiridas:', 148.5, 175, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    const skillsText = certificate.skills.join(' • ');
    const skillsLines = doc.splitTextToSize(skillsText, 250);
    doc.text(skillsLines, 148.5, 183, { align: 'center', maxWidth: 250 });
  }

  // Date
  if (certificate.dateEarned) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(`Fecha de emisión: ${certificate.dateEarned}`, 148.5, 185, { align: 'center' });
  } else {
    const today = new Date();
    const dateStr = today.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(`Fecha de emisión: ${dateStr}`, 148.5, 185, { align: 'center' });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'Este certificado está alineado con el Marco Común Europeo de Referencia (MCER)',
    148.5,
    195,
    { align: 'center' }
  );

  // Certificate ID
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text(`ID: CERT-${certificate.level}-${certificate.id}-${Date.now()}`, 148.5, 200, { align: 'center' });

  // Generate filename
  const filename = `Certificado_${certificate.level}_${studentName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  
  // Save PDF
  doc.save(filename);
};

