import mongoose from 'mongoose';

const InformationSchema = new mongoose.Schema({
    email: String,
    numero: Number,
    nom: String,
    numcontrat: Number,
});
  
const InformationModel = mongoose.model('Information', InformationSchema);
export default InformationModel;
