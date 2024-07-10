import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import './config/db.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import {Router} from './routes/routes.js';
import FacturesModel from './models/Facture.js';
import SuivieModel from './models/Suivie.js';
import ContratModel from './models/Contrat.js';
import crypto from "crypto";
import { authentificate } from './middleware/authentificate.js';



const app = express()

app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));

app.use(cookieParser())
dotenv.config({path: "./config/env"})

app.use('/contactmsyt', Router)

mongoose.connect('mongodb://localhost:27017/contactmsyt')


app.get('/getFacture', (req, res) => {
FacturesModel.find()
.then(facture => res.json(facture))
.catch(err => res.json(err))
})
app.get('/FacturesModel/factures', authentificate, async (req, res) => {
    try {
      const factures = await FacturesModel.find({ userId: req.user._id });
      res.json(factures);
    } catch (error) {
      res.status(500).send("Erreur lors de la récupération des factures.");
    }
  });
  
app.get('/getSuivie', (req, res) => {
    SuivieModel.find()
    .then(suivie => res.json(suivie))
    .catch(err => res.json(err))
    })
    app.get('/getContrat', (req, res) => {
        ContratModel.find()
        .then(contrat => res.json(contrat))
        .catch(err => res.json(err))
        })
        app.get('/ContratModel/contrat', authentificate, async (req, res) => {
            try {
              const contrat = await ContratModel.find({ userId: req.user._id });
              res.json(contrat);
            } catch (error) {
              res.status(500).send("Erreur lors de la récupération des contrats.");
            }
          });
        app.post('/forgot-password', async (req, res) => {
            const { email } = req.body;
            try {
                const user = await UserModel.findOne({ email });
                if (!user) {
                    return res.status(404).send('Aucun utilisateur trouvé avec cet email.');
                }
        
                const token = crypto.randomBytes(20).toString('hex');
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; 
        
                await user.save();
                const resetLink = `http://yourfrontenddomain.com/reset-password/${token}`;
        
                const mailOptions = {
                    from: 'your-email@gmail.com',
                    to: user.email,
                    subject: 'Réinitialisation de mot de passe',
                    text: `Pour réinitialiser votre mot de passe, veuillez cliquer sur ce lien : ${resetLink}`
                };
        
                await transporter.sendMail(mailOptions);
                res.send('Un email de réinitialisation a été envoyé.');
            } catch (error) {
                console.error(error);
                res.status(500).send('Erreur lors de la réinitialisation du mot de passe.');
            }
        });
        
 
app.listen(process.env.PORT,() => {
    console.log("App is Running")
})

