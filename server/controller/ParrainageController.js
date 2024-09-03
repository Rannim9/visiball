import { validationResult } from 'express-validator';
import ParrainageModel from '../models/Parrainage.js';

// Récupérer toutes les demandes de parrainage
export const getAllParrainages = async (req, res) => {
  try {
    const parrainages = await ParrainageModel.find({});
    return res.status(200).json({ success: true, data: parrainages });
  } catch (err) {
    console.error("Erreur lors de la récupération des parrainages:", err);
    return res.status(500).json({ success: false, error: "Erreur lors de la récupération des parrainages: " + err.message });
  }
};

// Ajouter une nouvelle demande de parrainage
export const addParrainage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { 
    nomBeneficiaire,
    emailBeneficiaire,
    telephoneBeneficiaire,
    siteweb,
    visite,
    shooting,
    gestion,
    referencement
  } = req.body;

  try {
    const newParrainage = new ParrainageModel({
      nomBeneficiaire,
      emailBeneficiaire,
      telephoneBeneficiaire,
      siteweb,
      visite,
      shooting,
      gestion,
      referencement
    });

    await newParrainage.save();
    return res.status(201).json({ success: true, message: "Parrainage ajouté avec succès" });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Erreur lors de l'ajout du parrainage: " + err.message });
  }
};

// Mettre à jour une demande de parrainage existante
export const updateParrainage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedParrainage = await ParrainageModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedParrainage) {
      return res.status(404).json({ success: false, message: "Parrainage non trouvé" });
    }
    return res.status(200).json({ success: true, message: "Parrainage mis à jour avec succès", data: updatedParrainage });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du parrainage:", err);
    return res.status(500).json({ success: false, error: "Erreur lors de la mise à jour du parrainage: " + err.message });
  }
};

// Récupérer un parrainage par son ID (si nécessaire)
export const getParrainageById = async (req, res) => {
  const { id } = req.params;

  try {
    const parrainage = await ParrainageModel.findById(id);
    if (!parrainage) {
      return res.status(404).json({ success: false, message: "Parrainage non trouvé" });
    }
    return res.status(200).json({ success: true, data: parrainage });
  } catch (err) {
    console.error("Erreur lors de la récupération du parrainage:", err);
    return res.status(500).json({ success: false, error: "Erreur lors de la récupération du parrainage: " + err.message });
  }
};
