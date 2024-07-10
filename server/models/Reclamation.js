import mongoose from 'mongoose';

const ReclamationSchema = new mongoose.Schema({
  objet: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  serviceConcerne: {
    type: String,
    required: true
  }
});

const ReclamationModel = mongoose.model('Reclamation', ReclamationSchema);

export { ReclamationModel as ReclamationModel }
