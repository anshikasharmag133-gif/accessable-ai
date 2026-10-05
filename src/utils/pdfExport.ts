import { jsPDF } from 'jspdf';
import { ReadingLevel, ExplanationResponse } from '../types';

interface ExportSimplifiedOptions {
  originalText: string;
  simplifiedText: string;
  level: ReadingLevel;
}

interface ExportExplanationOptions {
  originalText: string;
  explanation: ExplanationResponse;
}

function addHeader(doc: jsPDF, title: string) {
  // Brand banner
  doc.setFillColor(67, 56, 202); // Indigo-700
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('AccessAble AI', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Understand Anything. Access Everything.', 14, 18);

  const dateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.setFontSize(8);
  doc.text(dateStr, 196, 15, { align: 'right' });

  // Reset text color for body
  doc.setTextColor(30, 41, 59);
}

function checkPageBreak(doc: jsPDF, currentY: number, neededSpace = 20): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (currentY + neededSpace > pageHeight - 20) {
    doc.addPage();
    // Add small running header
    doc.setFillColor(243, 244, 246);
    doc.rect(0, 0, 210, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('AccessAble AI – Offline Reader Document', 14, 7);
    doc.setTextColor(30, 41, 59);
    return 20;
  }
  return currentY;
}

function addFooter(doc: jsPDF) {
  const totalPages = doc.getNumberOfPages();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, pageHeight - 12, 196, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('AccessAble AI · Cognitive Accessibility Platform · Keep for offline reading', 14, pageHeight - 7);
    doc.text(`Page ${i} of ${totalPages}`, 196, pageHeight - 7, { align: 'right' });
  }
}

export function exportSimplifiedTextToPdf({
  originalText,
  simplifiedText,
  level,
}: ExportSimplifiedOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - 28; // 14mm margins on each side
  let y = 34;

  addHeader(doc, 'Simplified Text Document');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('Simplified Text Document', 14, y);
  y += 7;

  // Metadata badge
  const levelLabel = level === 'very-simple' ? 'Very Simple' : level === 'student-friendly' ? 'Student-Friendly' : 'Simple';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229); // Indigo-600
  doc.text(`Reading Level: ${levelLabel}`, 14, y);
  y += 9;

  // Simplified Result Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Simplified Content', 14, y);
  y += 6;

  // Simplified Result Body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);

  const simplifiedLines = doc.splitTextToSize(simplifiedText, contentWidth);
  for (const line of simplifiedLines) {
    y = checkPageBreak(doc, y, 8);
    doc.text(line, 14, y);
    y += 6.5;
  }

  y += 6;
  y = checkPageBreak(doc, y, 30);

  // Original Text section (divider + box)
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, y, 196, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Original Reference Text:', 14, y);
  y += 5;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const origLines = doc.splitTextToSize(originalText, contentWidth);
  for (const line of origLines) {
    y = checkPageBreak(doc, y, 6);
    doc.text(line, 14, y);
    y += 5;
  }

  addFooter(doc);
  doc.save('accessable-ai-simplified.pdf');
}

export function exportExplanationToPdf({
  originalText,
  explanation,
}: ExportExplanationOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - 28;
  let y = 34;

  addHeader(doc, 'Concept & Document Explanation');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('Concept & Document Explanation', 14, y);
  y += 8;

  // Section A: Simple Explanation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text('A. Plain Language Explanation', 14, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  const explLines = doc.splitTextToSize(explanation.simpleExplanation, contentWidth);
  for (const line of explLines) {
    y = checkPageBreak(doc, y, 7);
    doc.text(line, 14, y);
    y += 6;
  }

  y += 5;
  y = checkPageBreak(doc, y, 20);

  // Section B: Key Points
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text(`B. Key Takeaways (${explanation.keyPoints.length})`, 14, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  for (let i = 0; i < explanation.keyPoints.length; i++) {
    const point = explanation.keyPoints[i];
    const bulletText = `•  ${point}`;
    const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 4);
    for (const bLine of bulletLines) {
      y = checkPageBreak(doc, y, 6);
      doc.text(bLine, 18, y);
      y += 5.5;
    }
  }

  y += 4;
  y = checkPageBreak(doc, y, 20);

  // Section C: Everyday Real-World Example
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text('C. Real-World Everyday Example', 14, y);
  y += 6;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const exLines = doc.splitTextToSize(explanation.example, contentWidth);
  for (const line of exLines) {
    y = checkPageBreak(doc, y, 6);
    doc.text(line, 14, y);
    y += 5.5;
  }

  y += 6;
  y = checkPageBreak(doc, y, 20);

  // Caution Note
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 83, 9); // Amber-700
  doc.text('Important Caution / Verification Notice:', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  const cautionLines = doc.splitTextToSize(explanation.caution, contentWidth);
  for (const line of cautionLines) {
    y = checkPageBreak(doc, y, 5);
    doc.text(line, 14, y);
    y += 4.5;
  }

  y += 6;
  y = checkPageBreak(doc, y, 25);

  // Original Text Reference
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, y, 196, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Original Excerpt:', 14, y);
  y += 5;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  const origLines = doc.splitTextToSize(originalText, contentWidth);
  for (const line of origLines) {
    y = checkPageBreak(doc, y, 5);
    doc.text(line, 14, y);
    y += 4.5;
  }

  addFooter(doc);
  doc.save('accessable-ai-explanation.pdf');
}

export function exportTranslationToPdf({
  originalText,
  translatedText,
  targetLanguageName,
  sourceLanguage,
}: {
  originalText: string;
  translatedText: string;
  targetLanguageName: string;
  sourceLanguage?: string;
}): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - 28;
  let y = 34;

  addHeader(doc, 'Multilingual Translation Document');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('Multilingual Translation Document', 14, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(124, 58, 237);
  doc.text(`Target: ${targetLanguageName} · Source: ${sourceLanguage || 'Auto-detected'}`, 14, y);
  y += 9;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Translated Content', 14, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);

  const lines = doc.splitTextToSize(translatedText, contentWidth);
  for (const line of lines) {
    y = checkPageBreak(doc, y, 8);
    doc.text(line, 14, y);
    y += 6.5;
  }

  y += 6;
  y = checkPageBreak(doc, y, 30);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, y, 196, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Original Reference Text:', 14, y);
  y += 5;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const origLines = doc.splitTextToSize(originalText, contentWidth);
  for (const line of origLines) {
    y = checkPageBreak(doc, y, 6);
    doc.text(line, 14, y);
    y += 5;
  }

  addFooter(doc);
  doc.save('accessable-ai-translation.pdf');
}
