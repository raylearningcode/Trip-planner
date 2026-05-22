// workers/pdf-worker.js - Background PDF generation
importScripts('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

self.addEventListener('message', async (e) => {
    const { type, data } = e.data;
    
    if (type === 'generatePDF') {
        try {
            const pdf = await generatePDF(data);
            self.postMessage({ 
                type: 'pdfReady', 
                pdf: pdf.output('datauristring') 
            });
        } catch (err) {
            self.postMessage({ 
                type: 'error', 
                error: err.message 
            });
        }
    }
});

async function generatePDF(tripData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Trip Itinerary', 20, 20);
    
    // Trip Details
    doc.setFontSize(12);
    let y = 40;
    
    doc.text(`Destination: ${tripData.destination || 'Not set'}`, 20, y);
    y += 10;
    doc.text(`Dates: ${tripData.startDate || ''} - ${tripData.endDate || ''}`, 20, y);
    y += 10;
    doc.text(`Budget: ${tripData.currency}${tripData.totalBudget || 0}`, 20, y);
    y += 20;
    
    // Day Plans
    if (tripData.dayPlans && tripData.dayPlans.length > 0) {
        doc.setFontSize(16);
        doc.text('Daily Itinerary', 20, y);
        y += 10;
        
        doc.setFontSize(10);
        tripData.dayPlans.forEach((day, idx) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            
            doc.setFont(undefined, 'bold');
            doc.text(`Day ${idx + 1}: ${day.title || 'Untitled'}`, 20, y);
            y += 7;
            
            doc.setFont(undefined, 'normal');
            const lines = doc.splitTextToSize(day.activities || 'No activities', 170);
            lines.forEach(line => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(line, 25, y);
                y += 5;
            });
            y += 5;
        });
    }
    
    // Bookings
    if (tripData.bookings && tripData.bookings.length > 0) {
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
        
        doc.setFontSize(16);
        doc.text('Bookings', 20, y);
        y += 10;
        
        doc.setFontSize(10);
        tripData.bookings.forEach(booking => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            
            doc.setFont(undefined, 'bold');
            doc.text(`${booking.type}: ${booking.name}`, 20, y);
            y += 7;
            
            doc.setFont(undefined, 'normal');
            doc.text(`Confirmation: ${booking.confirmation || 'N/A'}`, 25, y);
            y += 5;
            doc.text(`Date: ${booking.date || 'N/A'}`, 25, y);
            y += 10;
        });
    }
    
    return doc;
}
