import mongoose from 'mongoose';

const DevisSchema = new mongoose.Schema({
 
  creationSite: {
    type: String,
    enum: ['sitevitrine', 'sitecatalogue', 'siteecommerce', ''],
    default: '',
  },
  seo: {
    type: Boolean,
  },
  sea: {
    type: Boolean,
  },
  
  snapchat: {
    type: Boolean,
  },
  tiktok: {
    type: Boolean,
  },
  linkedin: {
    type: Boolean,
  },
  instagram: {
    type:Boolean,
  },
  facebook: {
    type:Boolean,
    
  },
  productCount: {
    type: String,
    validate: {
      validator: function(value) {
        return !this.shooting || value;
      },
      message: 'Le nombre de produits doit être fourni si shooting est sélectionné'
    }
  },
  productSize: {
    type: String,
    validate: {
      validator: function(value) {
        return !this.shooting || value;
      },
      message: 'La taille des produits doit être fournie si shooting est sélectionné'
    }
  },
  visite: { type: Boolean }, 
  pieceCount: {
    type: String,
    validate: {
      validator: function(value) {
        return !this.visite || value;
      },
      message: 'Le nombre de pièces doit être fourni si la visite virtuelle est sélectionnée'
    }
  },
  pieceSize: {
    type: String,
    validate: {
      validator: function(value) {
        return !this.visite || value;
      },
      message: 'La surface des pièces doit être fournie si la visite virtuelle est sélectionnée'
    }
  },
  isAutreChecked: { type: Boolean },
  autreValue: {
    type: String,
    validate: {
      validator: function(value) {
        return !this.isAutreChecked || value;
      },
      message: 'La description de "Autre" doit être fournie si "Autre" est sélectionné'
    }
  },
  validate: {
    type: Boolean,
    default: false
  }, 
  approved: {
    type: Boolean,
    default: false
  }
});
 

const DevisModel = mongoose.model("Devis", DevisSchema)

export { DevisModel as DevisModel }