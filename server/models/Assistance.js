import mongoose from 'mongoose';

const AssistanceSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    required: true,
    enum: ['serviceTechnique', 'serviceCommerciale', 'serviceJuridique', 'serviceAdministratif'],
    
  },
 
  description: {
    type: String,
    required: true
  }
});

const AssistanceModel = mongoose.model('Assistance', AssistanceSchema);

export { AssistanceModel as AssistanceModel };
