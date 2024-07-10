import { validationResult } from 'express-validator';
import { ParrainageModel } from '../models/Parrainage.js';

const addParrainage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array()); 
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

  console.log("Received Data:", req.body);

  try {
    const newParrainage = new ParrainageModel({
      nomBeneficiaire ,
      emailBeneficiaire ,
      telephoneBeneficiaire ,
      siteweb: siteweb,
      visite: visite,
      shooting:shooting,
      gestion: gestion, 
      referencement: referencement   
   });

    await newParrainage.save();
    return res.status(201).json({ success: true, message: "Parrainage ajouté avec succès" });
  } catch (err) {
    console.error( err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getParrainages = async (req, res) => {
  try {
    const parrainages = await ParrainageModel.find({});
    return res.status(200).json({ success: true, data: parrainages });
  } catch (err) {
    console.error( err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const updateParrainage = async (req, res) => {
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
      return res.status(404).json({ success: false, message: "Parrainage not found" });
  }
    return res.status(200).json({ success: true, message: "Parrainage mis à jour avec succès", data: updatedParrainage });
  } catch (err) {
    console.error( err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const parrainageController = {
  addParrainage,
  getParrainages,
  updateParrainage   
};

export { parrainageController };
