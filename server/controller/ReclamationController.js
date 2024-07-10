import express from 'express';
import { ReclamationModel } from '../models/Reclamation.js';
import { validationResult } from 'express-validator';

const addReclamations = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { userId, name } = req.user;
    const { objet, description, serviceConcerne } = req.body;

    try {
        const newReclamation = new ReclamationModel({
            userId,
            name, 
            objet,
            description,
            serviceConcerne
        });

        await newReclamation.save();

        return res.status(201).json({ success: true, message: "Réclamation ajoutée avec succès" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const getReclamations = async (req, res) => {
    try {
        const reclamations = await ReclamationModel.find({});
        return res.status(200).json({ success: true, data: reclamations });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};
const updateReclamations = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    try {
        const updateReclamations = await ReclamationModel.findByIdAndUpdate(id, updateData, { new: true });
        return res.status(200).json({ success: true, message: "Réclamation mis à jour avec succès", data: updatedReclamations });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};



const reclamationController = {
    addReclamations,
    getReclamations,
    updateReclamations
};

export { reclamationController };
