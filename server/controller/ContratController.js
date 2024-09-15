import ContratModel from '../models/Contrat.js';

export const getContrat = async (req, res) => {
    const userId = req.user._id;
    try {
        const contrats = await ContratModel.find({ userId: userId });
        res.status(200).json(contrats);
    } catch (error) {
        console.error("Erreur lors de la récupération des contrats: ", error);
        res.status(500).json({ message: "Erreur lors de la récupération des contrats: " + error.message });
    }
};  

export const addContrat = async (req, res) => {
    try {
        const totalContrats = await ContratModel.countDocuments({});
        const numeroContrat = `GB${(totalContrats + 1).toString().padStart(2, '0')}`;  

        const userId = req.user._id;
        const { nomreferent, email, raisonsociale, telephone, adresse, siret, duree, ht, tva, ttc } = req.body;


        const newContrat = new ContratModel({
            nomreferent,
            email,
            raisonsociale,
            telephone,
            adresse,
            siret,
            duree,
            ht,
            tva,
            ttc,
            userId,  
            numeroContrat
        });

        await newContrat.save();
        res.status(201).json(newContrat);
    } catch (error) {
        console.error("Erreur lors de l'ajout du contrat: ", error);
        res.status(409).json({ message: "Erreur lors de l'ajout du contrat: " + error.message });
    }
};


export const updateContrat = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id; 

    console.log('Updating contrat with ID:', id);
    console.log('Data received for update:', req.body);

    if (!req.body.raisonsociale || !req.body.raisonsociale.trim()) {
        return res.status(400).json({ message: 'La raison sociale est requise.' });
    }

    try {
        const contrat = await ContratModel.findById(id);
        if (!contrat) {
            return res.status(404).json({ message: 'Contrat non trouvé.' });
        }
        if (contrat.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Non autorisé à modifier ce contrat.' });
        }

        const updatedContrat = await ContratModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedContrat);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du contrat: ' + error.message });
    }
};

export const deleteContrat = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedContrat = await ContratModel.findByIdAndDelete(id);
        if (!deletedContrat) {
            return res.status(404).json({ message: "Contrat non trouvé" });
        }
        res.status(204).send(); 
    } catch (error) {
        console.error("Erreur lors de la suppression du contrat: ", error);
        res.status(500).json({ message: "Erreur lors de la suppression du contrat: " + error.message });
    }
};

export const getAllContrats = async (req, res) => {
    try {
        const contrats = await ContratModel.find();
        res.status(200).json(contrats);
    } catch (error) {
        console.error("Erreur lors de la récupération des contrats: ", error);
        res.status(500).json({ message: "Erreur lors de la récupération des contrats: " + error.message });
    }
}