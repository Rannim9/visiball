import InformationModel from '../models/Information.js'; 

export const getInformation = async (req, res) => {
    try {
        const information = await InformationModel.find(); 
        res.status(200).json(information); 
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des données: " + error.message }); 
    }
};

export const addInformation = async (req, res) => {
    const newInformation = new InformationModel(req.body); 
    try {
        await newInformation.save(); 
        res.status(201).json(newInformation);
    } catch (error) {
        res.status(409).json({ message: "Erreur lors de l'ajout des données: " + error.message });
    }
};

export const updateInformation = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedInformation = await InformationModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedInformation);
    } catch (error) {
        res.status(404).json({ message: "Données non trouvée: " + error.message });
    }
};

export const deleteInformation= async (req, res) => {
    const { id } = req.params;
    try {
        await InformationModel.findByIdAndRemove(id);
        res.status(204).send(); 
    } catch (error) {
        res.status(404).json({ message: "Données non trouvée: " + error.message });
    }
};
