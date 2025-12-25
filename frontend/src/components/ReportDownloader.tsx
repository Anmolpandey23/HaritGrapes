import React from 'react';
import jsPDF from 'jspdf';

interface ReportDownloaderProps {
  user: any;
}

// Utility for fetching data safely
function safeParseLS(key: string, fallback: any) {
  try {
    const ls = localStorage.getItem(key);
    return ls ? JSON.parse(ls) : fallback;
  } catch {
    return fallback;
  }
}

const ReportDownloader: React.FC<ReportDownloaderProps> = ({ user }) => {
  // Disease: most recent date and most common (excluding healthy)
  const getDiseaseInsights = () => {
    if (!user) return { mostCommon: 'N/A', lastDisease: 'N/A', lastDate: 'N/A' };
    const scans = safeParseLS(`scan_results_${user.uid}`, []);
    const counts: Record<string, number> = {};
    let lastDisease = 'N/A', lastDate = 'N/A';
    for (const scan of scans) {
      if (scan.disease && scan.disease !== 'Healthy Leaves') {
        counts[scan.disease] = (counts[scan.disease] || 0) + 1;
        if (!lastDate || (scan.timestamp && scan.timestamp > lastDate)) {
          lastDate = scan.timestamp;
          lastDisease = scan.disease;
        }
      }
    }
    let mostCommon = 'No Disease Detected', max = 0;
    for (const [dis, num] of Object.entries(counts)) {
      if (num > max) { max = num; mostCommon = dis; }
    }
    return { mostCommon, lastDisease, lastDate: lastDate ? new Date(lastDate).toLocaleString() : "N/A" };
  };

  // Last 3 fertilizer recommendations (disease-focused)
  const getFertRec = () => {
    if (!user) return [];
    return safeParseLS(`fertilizer_recommendations_${user.uid}`, []).slice(-3);
  };

  // Last 3 cluster counts and yields
  const getYieldHistory = () => {
    if (!user) return [];
    return safeParseLS(`yield_predictions_${user.uid}`, []).slice(-3);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('HaritGrapes — Actionable Farming Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Farmer: ${(user?.displayName || user?.email || '--')}`, 14, 34);

    // Disease section
    doc.setFontSize(12);
    const disease = getDiseaseInsights();
    doc.text('Top Disease To Focus:', 14, 46);
    doc.text(`Most Common: ${disease.mostCommon}`, 16, 54);
    doc.text(`Last Found: ${disease.lastDisease}`, 16, 61);
    doc.text(`Last Detection Date: ${disease.lastDate}`, 16, 68);

    // Fertilizer action history
    const recs = getFertRec();
    let y = 80;
    doc.text('Recent Fertilizer Recommendations:', 14, y);
    if (recs.length === 0) {
      doc.text("No fertilizer advice given yet. Please run a disease scan!", 16, y + 7);
      y += 12;
    } else {
      recs.forEach((r: any, i: number) => {
        doc.text(`${i + 1}: ${r.fertilizer || r.recommendation || 'N/A'}`, 16, y + 7);
        doc.text(`Disease: ${r.disease || 'N/A'}`, 26, y + 14);
        doc.text(`Dosage: ${r.dosage || 'N/A'}`, 26, y + 21);
        doc.text(`Advice: ${r.advice || 'N/A'}`, 26, y + 28);
        y += 32;
      });
    }

    // Yield prediction recap
    const yieldHist = getYieldHistory();
    doc.text('Recent Cluster Counts & Yield:', 14, y + 7);
    if (yieldHist.length === 0) {
      doc.text("No yield predictions yet. Try a cluster count and yield prediction!", 16, y + 14);
      y += 14;
    } else {
      yieldHist.forEach((p: any, i: number) => {
        doc.text(`${i + 1}: Clusters: ${p.clusters || '?'} → Predicted Yield: ${p.predictedYield || '?'} kg`, 16, y + 14 + (i * 8));
      });
      y += 14 + 8 * yieldHist.length;
    }

    // REAL AGRICULTURAL TIPS (customizable)
    y += 10;
    doc.setFontSize(12);
    doc.text('Actionable Growing Tips:', 14, y);
    doc.setFontSize(10);
    doc.text('- Inspect leaves weekly to catch and stop disease early.', 16, y + 8);
    doc.text('- Apply fertilizers as per above advice, and adjust by weather/severity.', 16, y + 15);
    doc.text('- Count clusters before harvest for better planning and marketing.', 16, y + 22);

    doc.text(
      'Stay consistent and track every scan for healthier, more profitable grapes!',
      14, y + 34, { maxWidth: 175 }
    );

    doc.save(`HaritGrapes_Field_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
  };

  return (
    <button
      onClick={handleDownload}
      className="px-6 py-2 bg-grape text-white rounded font-bold mt-3 transition hover:bg-primary hover:text-accent"
    >
      Download Field Recommendation PDF
    </button>
  );
};

export default ReportDownloader;
