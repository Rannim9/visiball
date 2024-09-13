import mongoose from 'mongoose';

const FacturesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nomClient: {
      type: String,
      required: true
  },
  emailClient: {
      type: String,
      required: true
  },
    numeroFacture: String,
    montantTH: Number,
    tva: Number,
    ttc: Number,  
    dateEdition: { type: Date, default: Date.now },
  statut: { type: String, enum: ['payee', 'non_payee'], default: 'non_payee' }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const FacturesModel = mongoose.model('Facture', FacturesSchema);
export default FacturesModel;     