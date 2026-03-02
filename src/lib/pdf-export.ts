import jsPDF from "jspdf";
import type { Story } from "@/types";

export async function exportStoryToPDF(story: Story, authorName: string, recipientName: string): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 25;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Cover page
  doc.setFillColor(13, 10, 15);
  doc.rect(0, 0, pageW, 297, "F");
  
  doc.setTextColor(201, 149, 110);
  doc.setFontSize(11);
  doc.text("✦ Digital Doula", pageW / 2, 60, { align: "center" });
  
  doc.setTextColor(240, 235, 232);
  doc.setFontSize(28);
  doc.text(story.storyTitle, pageW / 2, 100, { align: "center", maxWidth: contentW });
  
  doc.setTextColor(154, 136, 128);
  doc.setFontSize(12);
  doc.text(story.openingLine, pageW / 2, 130, { align: "center", maxWidth: contentW });
  
  doc.setTextColor(90, 79, 72);
  doc.setFontSize(10);
  doc.text(`From ${authorName || "someone who loves you"} to ${recipientName || "you"}`, pageW / 2, 270, { align: "center" });

  // Story slides
  for (const slide of story.slides) {
    doc.addPage();
    doc.setFillColor(20, 15, 18);
    doc.rect(0, 0, pageW, 297, "F");

    y = margin;
    doc.setTextColor(201, 149, 110);
    doc.setFontSize(9);
    doc.text(slide.emotion.toUpperCase(), margin, y);
    y += 12;

    doc.setTextColor(240, 235, 232);
    doc.setFontSize(20);
    const titleLines = doc.splitTextToSize(slide.title, contentW);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 10 + 8;

    doc.setTextColor(196, 180, 170);
    doc.setFontSize(11);
    doc.setLineHeightFactor(1.8);
    const proseLines = doc.splitTextToSize(slide.prose, contentW);
    doc.text(proseLines, margin, y);
    y += proseLines.length * 7 + 12;

    doc.setTextColor(122, 106, 96);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`"${slide.caption}"`, margin, y);
    doc.setFont("helvetica", "normal");
  }

  // Closing page
  doc.addPage();
  doc.setFillColor(13, 10, 15);
  doc.rect(0, 0, pageW, 297, "F");
  doc.setTextColor(154, 136, 128);
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  const closingLines = doc.splitTextToSize(story.closingMessage, contentW);
  const closingY = (297 - closingLines.length * 7) / 2;
  doc.text(closingLines, pageW / 2, closingY, { align: "center" });

  doc.save(`${story.storyTitle.replace(/\s+/g, "-")}.pdf`);
}
