import mongoose from 'mongoose';

const AssistanceSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    required: true,
    enum: ['serviceTechnique', 'serviceCommerciale', 'serviceJuridique', 'serviceAdministratif'],
    
  },
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  description: {
    type: String,
    required: true
  },
  responses: [{
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    message: String,
    timestamp: { type: Date, default: Date.now },
  }],
  status: {
   type: String,
   enum: ['en_attente', 'en_cours', 'cloturé'] ,
   default: 'en_attente'
  }
});

const AssistanceModel = mongoose.model('Assistance', AssistanceSchema);

export { AssistanceModel as AssistanceModel };
