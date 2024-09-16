import express from 'express';
import  { DevisModel } from '../models/Devis.js';  
import { validationResult} from 'express-validator';

const addDevis = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        userId,
        site_web_creation,
        referencement,
        social_media_management,
        shooting_produits,
        visite_virtuelle,
        validate,
        approved,
        // facebook,
        // productCount,
        // productSize,
        // pieceCount,
        // pieceSize,
        // isAutreChecked,
        // autreValue,   
     } = req.body;
     if (shooting_produits && (!shooting_produits.nombre_de_produits || !shooting_produits.dimension_produit)) {
        return res.status(400).json({ success: false, message: "Les informations sur les produits sont nécessaires pour le shooting." });
    }

    if (visite_virtuelle && (!visite_virtuelle.nombre_de_pieces || !visite_virtuelle.surface_metre_carree)) {
        return res.status(400).json({ success: false, message: "Les informations sur les pièces sont nécessaires pour la visite virtuelle." });
    }

    try {
        const newDevis = new DevisModel({
            userId,
            site_web_creation,
            referencement,
            social_media_management,
            shooting_produits,
            visite_virtuelle,
            validate,
            approved,
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
