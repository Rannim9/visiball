import AvisModel from '../models/Avis.js';
import { validationResult } from 'express-validator';

const addAvis = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const utilisateurId = req.user._id;
    const { rating, commentaire, typeAvis } = req.body;

    try {
        const newAvis = new AvisModel({
            utilisateurId,
            rating,
            commentaire,
            typeAvis,
            dateAvis: new Date()
        });

        await newAvis.save();
        return res.status(201).json({ success: true, message: "Avis ajouté avec succès" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const getAvis = async (req, res) => {
    try {
        const totalAvis = await AvisModel.countDocuments();
        const positifs = await AvisModel.countDocuments({ typeAvis: 'positif' });
        const neutres = await AvisModel.countDocuments({ typeAvis: 'neutre' });
        const negatifs = await AvisModel.countDocuments({ typeAvis: 'negatif' });

        const pourcentagePositifs = totalAvis > 0 ? (positifs / totalAvis) * 100 : 0;
        const pourcentageNeutres = totalAvis > 0 ? (neutres / totalAvis) * 100 : 0;
        const pourcentageNegatifs = totalAvis > 0 ? (negatifs / totalAvis) * 100 : 0;

        res.json({
            success: true,
            pourcentages: {
                positifs: pourcentagePositifs.toFixed(2),
                neutres: pourcentageNeutres.toFixed(2),
                negatifs: pourcentageNegatifs.toFixed(2)
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des pourcentages des avis', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateAvis = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { rating, commentaire, typeAvis } = req.body;
    const updateData = { rating, commentaire, typeAvis };

    try {
        const updatedAvis = await AvisModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedAvis) {
            return res.status(404).json({ success: false, message: "Avis non trouvé" });
        }
        return res.status(200).json({ success: true, message: "Avis mis à jour avec succès", data: updatedAvis });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const avisController = {
    addAvis,
    getAvis,
    updateAvis
};
export { avisController };

