import express from 'express';
import { authentificationController,getUserCount } from '../controller/userController.js';
import { check, body } from 'express-validator';
import { devisController } from '../controller/DevisController.js';
import { avisController } from '../controller/AvisController.js';
import { assistanceController,getaAssistanceCount } from '../controller/AssistanceController.js';
import { getSuivie } from '../controller/SuivieController.js';
import { updateContrat, getContrat, addContrat, getAllContrats,deleteContrat } from '../controller/ContratController.js';
import { authentificate } from '../middleware/authentificate.js';
import { getFactures, getFacturesPDF, addFacture, updateFacture, deleteFacture, getAllFactures } from '../controller/FactureController.js';
import { getAllParrainages, addParrainage, updateParrainage, getParrainageById,getParrainageCount, getParrainageByUserId } from '../controller/ParrainageController.js';
import { getAllReclamations, getReclamations, addReclamation, updateReclamation, getReclamationCount, getReclamationsByUser } from '../controller/ReclamationController.js';

const router = express.Router();

router.post('/login', [
    check('email').isEmail().withMessage("Adresse e-mail non valide"), 
    check('password').notEmpty().withMessage("Le mot de passe est obligatoire"),
], authentificationController.login);
  
router.post('/createUser', [
    check('name').notEmpty().withMessage('Le nom est obligatoire.'),
    check('email').isEmail().withMessage("Adresse e-mail non valide"), 
    check('password').notEmpty().withMessage("Le mot de passe est obligatoire"),
], authentificationController.CreateUser);

router.patch('/users/:id', [], authentificationController.updateUser);

router.post('/forgot-password', [
    check('email').isEmail().withMessage("Adresse e-mail non valide"),
], authentificationController.forgotPassword);

router.get('/users',authentificate, authentificationController.getAllUsers)
router.delete('/users/:id', authentificate, authentificationController.deleteUser)
router.post('/reset-password', [
    check('token').notEmpty().withMessage('Token de réinitialisation manquant'),
    check('newPassword').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
    check('newPassword').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Le mot de passe doit inclure au moins une majuscule, une minuscule, un chiffre et un caractère spécial.'),
], authentificationController.resetPassword);

router.post('/addAvis', authentificate, [
    check('rating').isInt({ min: 1, max: 5 }).withMessage('Le rating doit être entre 1 et 5.'),
    check('commentaire').isLength({ max: 1000 }).withMessage('Le commentaire ne peut pas dépasser 1000 caractères.'),
    check('typeAvis').isIn(['positif', 'neutre', 'negatif']).withMessage('Le type d\'avis doit être soit positif, neutre ou négatif.'),
], avisController.addAvis);

router.get('/avis', avisController.getAvis);
router.put('/updateAvis/:id', [
    check('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Le rating doit être entre 1 et 5.'),
    check('commentaire').optional().isLength({ max: 1000 }).withMessage('Le commentaire ne peut pas dépasser 1000 caractères.'),
    check('typeAvis').optional().isIn(['positif', 'neutre', 'negatif']).withMessage('Le type d\'avis doit être soit positif, neutre ou négatif.'),
], avisController.updateAvis);



router.post('/addDevis', [
    body('siteCatalogue').optional().isBoolean(),
    body('siteVitrine').optional().isBoolean(),
    body('siteEcommerce').optional().isBoolean(),
    body('seo').optional().isBoolean(),
    body('sea').optional().isBoolean(),
    body('snapchat').optional().isBoolean(),
    body('tiktok').optional().isBoolean(),
    body('linkedin').optional().isBoolean(),
    body('instagram').optional().isBoolean(),
    body('facebook').optional().isBoolean(),
    body('productCount').optional().isString(),
    body('productSize').optional().isString(),
    body('pieceCount').optional().isString(),
    body('pieceSize').optional().isString(),
    body('isAutreChecked').optional().isBoolean(),
    body('autreValue').optional().isString(),
], devisController.addDevis);

router.get('/devis', authentificate, devisController.getDevis);

router.put('/updateDevis/:id', [
    body('siteCatalogue').optional().isBoolean(),
    body('siteVitrine').optional().isBoolean(),
    body('siteEcommerce').optional().isBoolean(),
    body('seo').optional().isBoolean(),
    body('sea').optional().isBoolean(),
    body('snapchat').optional().isBoolean(),
    body('tiktok').optional().isBoolean(),
    body('linkedin').optional().isBoolean(),
    body('instagram').optional().isBoolean(),
    body('facebook').optional().isBoolean(),
    body('productCount').optional().isString(),
    body('productSize').optional().isString(),
    body('pieceCount').optional().isString(),
    body('pieceSize').optional().isString(),
    body('isAutreChecked').optional().isBoolean(),
    body('autreValue').optional().isString(),
], devisController.updateDevis);


router.patch('/devis/validate/:id', [
    body('approved').isBoolean()
], devisController.validateDevis)


router.post('/addAssistance', [
    body('description').notEmpty().withMessage('La description est requise'),
], assistanceController.addAssistance);

router.get('/assistance', assistanceController.getAssistance);
router.get('/assistance/:id', assistanceController.getMyAssistance);
router.put('/updateAssistance/:id', [
    body('serviceType').optional().isIn(['serviceTechnique', 'serviceCommerciale', 'serviceJuridique', 'serviceAdministratif']).withMessage('Le type de service est invalide'),
    body('description').optional(),
], assistanceController.updateAssistance);
router.patch('/assistance/:id',[
    body('sender').optional(),
    body('message').optional(),
    body('status').optional()
],authentificate, assistanceController.updateAssistance)

router.get('/reclamations', authentificate, getAllReclamations);
router.get('/reclamations', authentificate, getReclamations);
router.get('/reclamations/me/:id', authentificate, getReclamationsByUser);
router.post('/reclamations', authentificate, addReclamation);
router.put('/reclamations/:id', authentificate, updateReclamation);
router.get('/parrainages',authentificate,  getAllParrainages);
router.get('/parrainages/me/:id', authentificate, getParrainageByUserId)
router.post('/parrainages',authentificate,  addParrainage);
router.put('/parrainages/:id',authentificate, updateParrainage);
router.get('/parrainages/:id',authentificate, getParrainageById);
router.get('/suivie', authentificate, getSuivie);
router.get('/contrat', authentificate, getContrat); 
router.delete('/contrat/:id', authentificate, deleteContrat);
router.put('/updateContrat/:id', authentificate, updateContrat);
router.get('/contrat/all', authentificate, getAllContrats);
router.post('/contrat', authentificate, addContrat);
router.get('/factures', authentificate, getFactures);
router.get('/factures/pdf', authentificate, getFacturesPDF);
router.post('/factures', authentificate, addFacture);
router.get('/factures/all', authentificate, getAllFactures);
router.put('/factures/:id', authentificate, updateFacture);
router.put('/factures/:id', authentificate, updateFacture);
router.delete('/factures/:id', authentificate, deleteFacture);
router.get('/users/count', authentificate, getUserCount);
router.get('/assistances/count', authentificate, getaAssistanceCount);
router.get('/reclamations/count', authentificate, getReclamationCount);
router.get('/parrainages/count',authentificate, getParrainageCount);




export { router as Router };
