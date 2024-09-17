import FacturesModel from '../models/Facture.js'; 
import { PDFDocument, rgb } from 'pdf-lib';

export const getFactures = async (req, res) => {
    const userId = req.user._id; 
    const userRole = req.user.role;

    try {
        let factures;

        if (userRole === 'admin') {
            factures = await FacturesModel.find().populate('userId'); 
        } else {
            factures = await FacturesModel.find({ userId: userId });
        }

        res.status(200).json(factures); 
    } catch (error) {
        console.error("Erreur lors de la récupération des factures: ", error);
        res.status(500).send("Erreur lors de la récupération des factures." + error.message);
    }
};


export const getFacturesPDF = async (req, res) => {
    const userId = req.user ? req.user._id : null;
    try {
        const filter = userId ? { userId: userId } : {};
        const factures = await FacturesModel.find(filter);

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        const { height } = page.getSize();
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
            y -= 20;
            page.drawText(`Statut: ${facture.statut === 'payee' ? 'Payée' : 'Non Payée'}`, { x: 50, y, size: 12 });
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
    const { montantTH, tva, ttc, numeroFacture, statut } = req.body;
    
    if (!montantTH || !tva || !ttc || !numeroFacture) {
        return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    try {
        const nomClient = req.user.name;
        const emailClient = req.user.email;

        if (!nomClient || !emailClient) {
            return res.status(400).json({ message: "Nom ou email de client manquant" });
        }

        const newFacture = new FacturesModel({
            montantTH,
            tva,  
            ttc,
            numeroFacture,
            statut,
            nomClient,  
            emailClient,
            userId: req.user._id 
        });

        await newFacture.save();
        res.status(201).json({ success: true, message: "Facture ajoutée avec succès", facture: newFacture });
    } catch (error) {
        res.status(409).json({ message: "Erreur lors de l'ajout de la facture: " + error.message });
    }
};


export const updateFacture = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedFacture = await FacturesModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedFacture) {
            return res.status(404).json({ message: "Facture non trouvée" });
        }
        res.status(200).json(updatedFacture);
    } catch (error) {
        res.status(404).json({ message: "Erreur lors de la mise à jour de la facture: " + error.message });
    }
};

export const deleteFacture = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedFacture = await FacturesModel.findByIdAndRemove(id);
        if (!deletedFacture) {
            return res.status(404).json({ message: "Facture non trouvée" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: "Erreur lors de la suppression de la facture: " + error.message });
    }
};

export const getAllFactures = async (req, res) => {
    try {
        const factures = await FacturesModel.find();  
        res.status(200).json(factures);
    } catch (error) {
        console.error("Erreur lors de la récupération des factures: ", error);
        res.status(500).json({ message: "Erreur lors de la récupération des factures: " + error.message });
    }  
};
