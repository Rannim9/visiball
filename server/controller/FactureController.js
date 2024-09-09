import FacturesModel from '../models/Facture.js'; 
import { PDFDocument, rgb } from 'pdf-lib';

export const getFactures = async (req, res) => {
    const userId = req.user._id; 
    try {
        const factures = await FacturesModel.find({ userId: userId });
        res.status(200).json(factures); 
    } catch (error) {
        console.error("Erreur lors de la récupération des contrats: ", error);
        res.status(500).send("Erreur lors de la récupération des factures."+ error.message);
    }
};
    
export const getFacturesPDF = async (req, res) => {
    const userId = req.user._id;
    try {
        const factures = await FacturesModel.find({ userId: userId });
        
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        const { width, height } = page.getSize();
        page.drawText('Factures', { x: 50, y: height - 50, size: 20, color: rgb(0, 0, 0) });

        let y = height - 80;
        factures.forEach(facture => {
            page.drawText(`Numéro de Facture: ${facture.numeroFacture}`, { x: 50, y, size: 12 });
            y -= 20;
            page.drawText(`Montant HT: ${facture.montantTH ? facture.montantTH.toFixed(2) : 'N/A'} dt`, { x: 50, y, size: 12 });
            y -= 20;
            page.drawText(`TVA: ${facture.tva ? facture.tva.toFixed(2) : 'N/A'} %`, { x: 50, y, size: 12 });
            y -= 20;
            page.drawText(`TTC: ${facture.ttc ? facture.ttc.toFixed(2) : 'N/A'} dt`, { x: 50, y, size: 12 });
            y -= 20;
            page.drawText(`Date d'Édition: ${facture.dateEdition ? new Date(facture.dateEdition).toLocaleDateString() : 'N/A'}`, { x: 50, y, size: 12 });
            y -= 40;
        });

        const pdfBytes = await pdfDoc.save();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=factures.pdf');
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        res.status(500).send("Erreur lors de la génération du PDF.");
    }
};

export const addFacture = async (req, res) => {
    console.log(req.body);
    const newFacture = new FacturesModel(req.body);
    try {
        await newFacture.save();
        res.status(201).json(newFacture);
    } catch (error) {
        res.status(409).json({ message: "Erreur lors de l'ajout de la facture: " + error.message });
    }
};

export const updateFacture = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id; 
    console.log('Updating contrat with ID:', id);
    console.log('Data received for update:', req.body);
    try {
        const updatedFacture = await FacturesModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedFacture);
    } catch (error) {
        res.status(404).json({ message: "Facture non trouvée: " + error.message });
    }
};

export const deleteFacture = async (req, res) => {
    const { id } = req.params;
    try {
        await FacturesModel.findByIdAndRemove(id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: "Facture non trouvée: " + error.message });
    }
};
export const getAllFactures = async (req, res) => {
    try {
        const factures  = await FactureModel.find();
        res.status(200).json(factures);
    } catch (error) {
        console.error("Erreur lors de la récupération des factures: ", error);
        res.status(500).json({ message: "Erreur lors de la récupération des factures: " + error.message });
    }
}
