import express from 'express';
import  { DevisModel } from '../models/Devis.js';  
import { validationResult} from 'express-validator';

const addDevis = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        creationSite,
        seo,
        sea,
        snapchat,
        tiktok,
        linkedin,
        instagram,
        facebook,
        productCount,
        productSize,
        pieceCount,
        pieceSize,
        isAutreChecked,
        autreValue,   
     } = req.body;
     if (req.body.shooting && (!productCount || !productSize)) {
        return res.status(400).json({ success: false, message: "Les informations sur les produits sont nécessaires pour le shooting." });
    }

    if (req.body.visite && (!pieceCount || !pieceSize)) {
        return res.status(400).json({ success: false, message: "Les informations sur les pièces sont nécessaires pour la visite virtuelle." });
    }

    try {
        const newDevis = new DevisModel({
            creationSite,
            seo,
            sea,
            snapchat,
            tiktok,
            linkedin,
            instagram,
            facebook,
            productCount,
            productSize,
            pieceCount,
            pieceSize,
            isAutreChecked, 
            autreValue, 
                });

        await newDevis.save();
        return res.status(201).json({ success: true, message: "Devis ajouté avec succès" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const getDevis = async (req, res) => {
    try {
        const devis = await DevisModel.find({});
        return res.status(200).json({ success: true, data: devis });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const updateDevis = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedDevis = await DevisModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedDevis) {
            return res.status(404).json({ success: false, message: "Devis not found" });
        }
        return res.status(200).json({ success: true, message: "Devis updated successfully", data: updatedDevis });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const validateDevis = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    console.log("entree :", body)

    try {
        const updatedDevis = await DevisModel.findById(id);
        if (!updatedDevis) {
            return res.status(404).json({ success: false, message: "Devis not found" });
        }
        updatedDevis.approved = body.approved
        updatedDevis.validate = true
        await updatedDevis.save()
        return res.status(200).json({ success: true, message: "Devis updated successfully", data: updatedDevis });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};


const devisController = {
    addDevis,
    getDevis,
    updateDevis,
    validateDevis
};

export { devisController };
