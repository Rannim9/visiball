import mongoose from 'mongoose';

const AssistanceSchema = new mongoose.Schema({
  date :{
    type: Date,
    required: true,
    default: Date.now
  },
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
    },
    message: String,
    timestamp: { type: Date, default: Date.now },
  }],
  status: {
   type: String,
   enum: ['en_attente', 'en_cours', 'cloturé'] ,
   default: 'en_attente'
  },
  actions: [{
    actionType: { type: String, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    timestamp: { type: Date, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed },
  }]
});

const AssistanceModel = mongoose.model('Assistance', AssistanceSchema);

export { AssistanceModel as AssistanceModel };
