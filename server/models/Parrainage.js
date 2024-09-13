import mongoose from 'mongoose';

const parrainageSchema = new mongoose.Schema({
  nomClient: {
    type: String,
    required: true
},
emailClient: {
  type: String,
  required: true
},
  nomBeneficiaire: { 
    type: String,
    required: true
  },
  DateSoumission: { type: Date,
  default: Date.now 
},
  telephoneBeneficiaire: {
    type: String,
    required: true
  },
  emailBeneficiaire: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} n'est pas une adresse e-mail valide!`
    }
  },
  siteweb: {
    type: Boolean,
    default: false
  },
  visite: {
    type: Boolean,
    default: false
  },
  shooting: {
    type: Boolean,
    default: false
  },
  gestion: {
    type: Boolean,
    default: false
  },
  referencement: {
    type: Boolean,
    default: false
  },
});

parrainageSchema.virtual('serviceAParrainer').get(function() {
  const services = [];
  if (this.siteweb) services.push('Site Web');
  if (this.visite) services.push('Visite virtuel');
  if (this.shooting) services.push('Shooting produit 360°');
  if (this.gestion) services.push('Gestion des réseaux sociaux');
  if (this.referencement) services.push('Référencement');

  return services.length > 0 ? services.join(', ') : 'Aucun service sélectionné';
});

parrainageSchema.set('toJSON', { virtuals: true });

const ParrainageModel = mongoose.model('Parrainage', parrainageSchema);

export default ParrainageModel;
