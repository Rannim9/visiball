import mongoose from 'mongoose';

const ContratSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nomreferent: { type: String, required: true },
    raisonsociale: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, required: true },
    adresse: { type: String, required: true },
    siret: { type: String, required: true },
    duree: { type: String, required: true },
    ht: { type: Number, required: true },
    tva: { type: Number, required: true },
    ttc: { type: Number, required: true },

});

const ContratModel = mongoose.model('Contrat', ContratSchema);

export default ContratModel;