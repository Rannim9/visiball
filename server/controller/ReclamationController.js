import ReclamationModel from '../models/Reclamation.js';
import ContratModel from '../models/Contrat.js';

export const getAllReclamations = async (req, res) => {
    try {
      const reclamations = await ReclamationModel.find({});
      return res.status(200).json({ success: true, data: reclamations });
    } catch (err) {
      console.error("Erreur lors de la récupération des reclamations:", err);
      return res.status(500).json({ success: false, error: "Erreur lors de la récupération des reclamations: " + err.message });
    }
  };
  
export const getReclamations = async (req, res) => {
    try {
        const userId = req.user._id;
    const reclamations = await ReclamationModel.find({ userId });

    const contrat = await ContratModel.findOne({ userId });

    if (!contrat) {
        return res.status(404).json({ message: "Contrat non trouvé pour cet utilisateur" });
      }
      const reclamationsWithPhone = reclamations.map(reclamation => ({
        ...reclamation._doc,
        telephone: contrat.telephone 
      }));
        return res.status(200).json({ success: true, data: reclamations });
    } catch (err) {
        console.error("Erreur lors de la récupération des réclamations:", err);
        return res.status(500).json({ success: false, error: "Erreur lors de la récupération des réclamations: " + err.message });
    }
};

export const getReclamationCount = async (req, res) => {
    try {
        const count = await ReclamationModel.countDocuments();
        return res.status(200).json({ count });
    } catch (err) {
        console.error("Erreur lors de la récupération du nombre des réclamations:", err);
        return res.status(500).json({ error: "Erreur lors de la récupération du nombre des réclamations" });
    }
};


export const addReclamation = async (req, res) => {
    const { objet, description, serviceConcerne } = req.body;
    console.log("Received data:", { objet, description, serviceConcerne });
    try {
        const nomClient = req.user.name ;
        const emailClient = req.user.email ;

        console.log("nomClient:", nomClient, "emailClient:", emailClient);
        if (!nomClient || !emailClient) {
            return res.status(400).json({ message: "Nom ou email de client manquant" });
        }

        const newReclamation = new ReclamationModel({
            nomClient,
            emailClient,
            telephone,
            objet,
            description,
            serviceConcerne,
            requestDate: new Date() 
        });

        await newReclamation.save();
        return res.status(201).json({ success: true, message: "Réclamation soumise avec succès" });
    } catch (err) {
        console.error("Erreur lors de la soumission de la réclamation:", err);
        return res.status(500).json({ success: false, error: "Erreur lors de la soumission de la réclamation: " + err.message });
    }
};

export const updateReclamation = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedReclamation = await ReclamationModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedReclamation) {
            return res.status(404).json({ success: false, message: "Réclamation non trouvée" });
        }
        return res.status(200).json({ success: true, message: "Réclamation mise à jour avec succès", data: updatedReclamation });
    } catch (err) {    
        console.error("Erreur lors de la mise à jour de la réclamation:", err);
        return res.status(500).json({ success: false, error: "Erreur lors de la mise à jour de la réclamation: " + err.message });
    }
};
