import mongoose from 'mongoose';

const DevisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Site web creation with enum options
    site_web_creation: {
      type: String,
      enum: ['sitevitrine', 'sitecatalogue', 'siteecommerce'],
      required: false,
    },

    // Referencement with SEO and SEA options
    referencement: {
      seo: { type: Boolean, default: false },
      sea: { type: Boolean, default: false },
    },

    // Social media management, including custom 'autre' option
    social_media_management: {
      facebook: { type: Boolean, default: false },
      instagram: { type: Boolean, default: false },
      linkedin: { type: Boolean, default: false },
      tiktok: { type: Boolean, default: false },
      snapchat: { type: Boolean, default: false },
      autre: {
        selected: { type: Boolean, default: false },
        description: {
          type: String,
          validate: {
            validator: function (value) {
              return !this.social_media_management.autre.selected || !!value;
            },
            message: 'La description de "Autre" doit être fournie si "Autre" est sélectionné',
          },
        },
      },
    },

    // Shooting produits with enum for number of products
    shooting_produits: {
      nombre_de_produits: {
        type: String,
        enum: ['10-29', '30-49', '50+'],
        validate: {
          validator: function (value) {
            return !this.shooting_produits || !!value;
          },
          message: 'Le nombre de produits doit être sélectionné si shooting est sélectionné',
        },
      },
      dimension_produit: {
        type: String,
        enum: ['petit', 'Moyenne', 'grand'],
        validate: {
          validator: function (value) {
            return !this.shooting_produits || !!value;
          },
          message: 'La dimension produit carrée doit être fournie si shooting produits est sélectionnée',
        },
      },
    },

    // Visite virtuelle with number of rooms and surface area options
    visite_virtuelle: {
      nombre_de_pieces: {
        type: String,
        enum: ['5-9', '10-19', '20+'],
        validate: {
          validator: function (value) {
            return !this.visite_virtuelle || !!value;
          },
          message: 'Le nombre de pièces doit être fourni si visite virtuelle est sélectionnée',
        },
      },
      surface_metre_carree: {
        type: String,
        enum: ['100', '200', '300'],
        validate: {
          validator: function (value) {
            return !this.visite_virtuelle || !!value;
          },
          message: 'La surface en mètre carrée doit être fournie si visite virtuelle est sélectionnée',
        },
      },
    },

    // Validation and approval flags
    validate: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create the model from the schema
const DevisModel = mongoose.model('Devis', DevisSchema);

export { DevisModel };
