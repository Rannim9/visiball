import mongoose from 'mongoose';

const SuivieSchema = new mongoose.Schema({
    dateEnvoie: Date,
    statut: String,
    dateTraitement: Date,
    referent: String,
    consulter: String
});
  
const SuivieModel = mongoose.model('Suivie', SuivieSchema);
export default SuivieModel;
