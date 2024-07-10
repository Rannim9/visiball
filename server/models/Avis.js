import mongoose from 'mongoose';

const AvisSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  commentaire: {
    type: String,
    required: true,
    maxlength: 1000
  },
  dateAvis: {
    type: Date,
    default: Date.now 
  },
  typeAvis: {
    type: String,
    enum: ['positif', 'neutre', 'negatif'], 
    required: true
  }
});

const AvisModel = mongoose.model("Avis", AvisSchema);
export default AvisModel;
