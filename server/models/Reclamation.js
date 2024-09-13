
import mongoose from 'mongoose';

const ReclamationSchema = new mongoose.Schema({
    nomClient: {
        type: String,
        required: true
    },
    emailClient: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    objet: { type: String, required: true },
    description: { type: String, required: true },
    serviceConcerne: {
        type: String,
        enum: ['administratif', 'technique', 'commercial', 'juridique'],
        required: true,
    },
    statut: {
        type: String,
        enum: ['en attente', 'en cours', 'résolu'],
        default: 'en attente',
    },     
    requestDate: { type: Date, default: Date.now }
});

const ReclamationModel = mongoose.model('Reclamation', ReclamationSchema);

export default ReclamationModel;
