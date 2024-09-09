import mongoose from 'mongoose';

const FacturesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    numeroFacture: String,
    montantTH: Number,
    tva: Number,
    ttc: Number,
    dateEdition: Date
});
const FacturesModel = mongoose.model('Facture', FacturesSchema);
export default FacturesModel; 