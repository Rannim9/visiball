import mongoose from 'mongoose';
 
const parrainageSchema = new mongoose.Schema({

  nomBeneficiaire: { 
    type: String,
     required: true
     },
     telephoneBeneficiaire: {
      type: String,
      required: true
     },
     siteweb: {
      type: Boolean,
      required: true
     },
     visite: {
      type: Boolean,
      required: true
     },

     shooting: {
      type: Boolean,
      required: true
     }, 
     gestion: {
      type: Boolean,
      required: true
     },
     referencement: {
      type: Boolean,
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
    siteweb:  {
      type: Boolean,
      default:false
    },
      visite:
      {
        type: Boolean,
        default:false
      },
      shooting:
      {
        type: Boolean,
        default:false
      },

      gestion: 
      {
        type: Boolean,
        default:false
      },
      referencement: 
      {
        type: Boolean,
        default:false
      },

});

const ParrainageModel = mongoose.model('Parrainage', parrainageSchema);

export default ParrainageModel  ;
  