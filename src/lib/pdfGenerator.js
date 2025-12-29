// src/lib/pdfGenerator.js
// PDF generation for GHG emissions reports using jsPDF

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatEmissions, kgToTonnes } from './calculatorUtils';

/**
 * Generate PDF report for GHG emissions calculation
 * @param {Object} calculationData - Complete calculation data with all entries
 * @param {Object} totals - Totals object from calculateTotalEmissions
 * @param {Object} equivalencies - Equivalencies object
 * @param {string} companyName - Optional company name
 * @returns {jsPDF} PDF document
 */
export function generatePDFReport(calculationData, totals, equivalencies, companyName = 'Your Organization') {
  // Initialize PDF (A4 size)
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 20;

  // HEADER SECTION
  // Add logo (if available)
  try {
    // Note: Logo should be converted to base64 or loaded from public folder
    // For now, we'll just add the company name as header
    doc.setFontSize(20);
    doc.setTextColor(34, 139, 34); // Green color
    doc.text('Ploxi Earth', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;
  } catch (error) {
    console.log('Logo not available');
  }

  // Report Title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('GHG Emissions Calculation Report', pageWidth / 2, currentY, { align: 'center' });
  currentY += 8;

  // Company Name
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(companyName, pageWidth / 2, currentY, { align: 'center' });
  currentY += 8;

  // Date
  const reportDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.setFontSize(10);
  doc.text(`Report Generated: ${reportDate}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;

  // EXECUTIVE SUMMARY
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Executive Summary', 14, currentY);
  currentY += 8;

  // Summary Box
  doc.setFillColor(240, 248, 255); // Light blue background
  doc.rect(14, currentY, pageWidth - 28, 35, 'F');

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Emissions: ${formatEmissions(totals.total)}`, 20, currentY + 8);
  doc.text(`Scope 1 (Direct): ${formatEmissions(totals.scope1)}`, 20, currentY + 16);
  doc.text(`Scope 2 (Indirect Energy): ${formatEmissions(totals.scope2)}`, 20, currentY + 24);
  doc.text(`Scope 3 (Other Indirect): ${formatEmissions(totals.scope3)}`, 20, currentY + 32);

  currentY += 45;

  // DETAILED BREAKDOWN - SCOPE 1
  if (calculationData.scope1 && calculationData.scope1.length > 0) {
    currentY = addScopeSection(doc, 'Scope 1: Direct Emissions', calculationData.scope1, currentY, pageHeight);
  }

  // SCOPE 2
  if (calculationData.scope2 && calculationData.scope2.length > 0) {
    currentY = addScopeSection(doc, 'Scope 2: Indirect Energy Emissions', calculationData.scope2, currentY, pageHeight);
  }

  // SCOPE 3
  if (calculationData.scope3 && calculationData.scope3.length > 0) {
    currentY = addScopeSection(doc, 'Scope 3: Other Indirect Emissions', calculationData.scope3, currentY, pageHeight);
  }

  // EQUIVALENCIES SECTION
  currentY = addEquivalenciesSection(doc, equivalencies, currentY, pageHeight);

  // FOOTER
  addFooter(doc);

  return doc;
}

/**
 * Add scope section with table
 * @param {jsPDF} doc - PDF document
 * @param {string} title - Section title
 * @param {Array} entries - Emission entries
 * @param {number} startY - Starting Y position
 * @param {number} pageHeight - Page height for overflow check
 * @returns {number} New Y position
 */
function addScopeSection(doc, title, entries, startY, pageHeight) {
  // Check if new page needed
  if (startY > pageHeight - 60) {
    doc.addPage();
    startY = 20;
  }

  // Section title
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(title, 14, startY);
  startY += 6;

  // Prepare table data
  const tableData = entries.map(entry => {
    const emissions = entry.activityData * entry.emissionFactor;
    return [
      entry.source || entry.category,
      entry.activityData.toFixed(2),
      entry.unit,
      entry.emissionFactor.toFixed(4),
      emissions.toFixed(2),
    ];
  });

  // Add total row
  const scopeTotal = entries.reduce((sum, entry) => {
    return sum + (entry.activityData * entry.emissionFactor);
  }, 0);

  tableData.push([
    'Total',
    '',
    '',
    '',
    scopeTotal.toFixed(2),
  ]);

  // Generate table
  doc.autoTable({
    startY: startY,
    head: [['Source', 'Activity Data', 'Unit', 'Emission Factor', 'Emissions (kg CO2e)']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [34, 139, 34], // Green
      textColor: [255, 255, 255],
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
    },
    footStyles: {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 14, right: 14 },
  });

  return doc.lastAutoTable.finalY + 12;
}

/**
 * Add equivalencies section
 * @param {jsPDF} doc - PDF document
 * @param {Object} equivalencies - Equivalencies data
 * @param {number} startY - Starting Y position
 * @param {number} pageHeight - Page height
 * @returns {number} New Y position
 */
function addEquivalenciesSection(doc, equivalencies, startY, pageHeight) {
  // Check if new page needed
  if (startY > pageHeight - 80) {
    doc.addPage();
    startY = 20;
  }

  // Section title
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('What Does This Mean?', 14, startY);
  startY += 6;

  // Description
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Your emissions are equivalent to:', 14, startY);
  startY += 8;

  // Equivalencies box
  doc.setFillColor(250, 250, 250);
  doc.rect(14, startY, doc.internal.pageSize.getWidth() - 28, 50, 'F');

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const lineHeight = 8;

  doc.text(`🚗  ${equivalencies.cars} passenger vehicles driven for one year`, 20, startY + 8);
  doc.text(`🌳  ${equivalencies.trees} tree seedlings grown for 10 years`, 20, startY + 8 + lineHeight);
  doc.text(`🏠  ${equivalencies.homes} homes' energy use for one year`, 20, startY + 8 + lineHeight * 2);
  doc.text(`📱  ${equivalencies.smartphones.toLocaleString()} smartphone charges`, 20, startY + 8 + lineHeight * 3);
  doc.text(`✈️  ${equivalencies.flightMiles.toLocaleString()} miles on a flight`, 20, startY + 8 + lineHeight * 4);

  startY += 60;

  // Methodology note
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  const methodologyText = 'Calculations based on EPA GHG Emission Factors (2024), India GHG Program, and IPCC Guidelines. ' +
                          'Equivalencies from EPA Greenhouse Gas Equivalencies Calculator.';
  const splitText = doc.splitTextToSize(methodologyText, doc.internal.pageSize.getWidth() - 28);
  doc.text(splitText, 14, startY);

  return startY + 15;
}

/**
 * Add footer to all pages
 * @param {jsPDF} doc - PDF document
 */
function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, doc.internal.pageSize.getHeight() - 15, doc.internal.pageSize.getWidth() - 14, doc.internal.pageSize.getHeight() - 15);

    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      'Generated by Ploxi Earth GHG Calculator | www.ploxiearth.com',
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );

    // Page number
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 14,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'right' }
    );
  }
}

/**
 * Download the generated PDF
 * @param {jsPDF} doc - PDF document
 * @param {string} filename - Desired filename
 */
export function downloadPDF(doc, filename = 'ghg-emissions-report.pdf') {
  doc.save(filename);
}

/**
 * Generate and download PDF in one step
 * @param {Object} calculationData - Calculation data
 * @param {Object} totals - Totals object
 * @param {Object} equivalencies - Equivalencies object
 * @param {string} companyName - Company name
 * @param {string} filename - Filename
 */
export function generateAndDownloadPDF(calculationData, totals, equivalencies, companyName, filename) {
  const doc = generatePDFReport(calculationData, totals, equivalencies, companyName);
  downloadPDF(doc, filename);
}