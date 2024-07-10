import SuivieModel from '../models/Suivie.js'; 

export const getSuivie = async (req, res) => {
    try {
        const suivie = await SuivieModel.find(); 
        res.status(200).json(suivie); 
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des demande de suuivie: " + error.message }); 
    }
};

export const addSuivie = async (req, res) => {
    const newSuivie = new SuivieModel(req.body); 
    try {
        await newSuivie.save(); 
        res.status(201).json(newSuivie);
    } catch (error) {
        res.status(409).json({ message: "Erreur lors de l'ajout de la demande de suivie: " + error.message });
    }
};

export const updateSuivie = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedSuivie = await SuivieModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedSuivie);
    } catch (error) {
        res.status(404).json({ message: "Demande de suivie non trouvée: " + error.message });
    }
};

export const deleteSuivie = async (req, res) => {
    const { id } = req.params;
    try {
        await SuivieModel.findByIdAndRemove(id);
        res.status(204).send(); 
    } catch (error) {
        res.status(404).json({ message: "Demande de suivie non trouvée: " + error.message });
    }
};
