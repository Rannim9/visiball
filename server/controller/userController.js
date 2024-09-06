import express from 'express'; 
import { UserModel } from '../models/User.js';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: "./routes/.env" });

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const userExist = await UserModel.findOne({ email });
        if (!userExist) {
            return res.status(400).json({
                success: false,
                error: "Utilisateur non enregistré",
            });
        }
        if (!userExist.activated) {
            return res.status(400).json({
                success: false,
                error:  "Compte desactivé",
            });
        }                                                                          
        const isPasswordMatch = await bcrypt.compare(password, userExist.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false, 
                error:  "Mot de passe incorrect",
            });
        }
        
        const token = jwt.sign(
            { _id: userExist._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            success: true,
            message: "Connecté avec succès",
            token: token,
            user: userExist,
            name: userExist.name,
            role: userExist.role
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    if (!validatePassword(password)) {
        return res.status(400).json({ success: false, message: "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial." });
    }

    try {
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(409).json({ success: false, message: "Adresse e-mail est déjà utilisée" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        return res.status(201).json({ success: true, message: "Utilisateur créé avec succès", user: newUser });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, activated, role, password } = req.body;

    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        // Check if the email is already used by another user
        if (email && email !== user.email) {
            const emailExist = await UserModel.findOne({ email });
            if (emailExist) {
                return res.status(409).json({ success: false, message: "Adresse e-mail est déjà utilisée" });
            }
            user.email = email;
        }

        // Update name if provided
        if (name) {
            user.name = name;
        }

        // Update activated status if provided
        if (typeof activated !== 'undefined') {
            user.activated = activated;
        }

        if (role) {
            user.role = role;
        }
        if (password !== "") {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            user.password = hashedPassword;
        }
        await user.save();

        return res.status(200).json({ success: true, message: "Utilisateur mis à jour avec succès", user });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};
const deleteUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    try {
        const result = await UserModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
        }
        return res.status(200).json({ success: true, message: "Utilisateur retiré avec succès" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Aucun utilisateur trouvé avec cet email." });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; 

        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const resetUrl = `http://${req.headers.host}/reset-password/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: user.email,
            subject: 'Réinitialisation du mot de passe',
            text: `Vous avez demandé la réinitialisation du mot de passe pour votre compte.\n\nVeuillez cliquer sur le lien suivant, ou le copier dans votre navigateur pour compléter le processus :\n\n${resetUrl}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Un email de réinitialisation a été envoyé.' });
    } catch (error) {
        console.error(error);
        console.Console(error)
        res.status(500).json({ success: false, message: 'Erreur lors du traitement de la demande.' });
    }
};
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Le token de réinitialisation est invalide ou a expiré." });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({ success: false, message: "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Mot de passe réinitialisé avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la réinitialisation du mot de passe. ' });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find(); // Corrected the find method
        res.status(200).json(users);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs: ", error);
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs: " + error.message });
    }
};
const authentificationController = {
    CreateUser: createUser,
    login: login,
    forgotPassword: forgotPassword, 
    resetPassword: resetPassword,
    getAllUsers: getAllUsers,
    updateUser: updateUser,
    deleteUser: deleteUser
};


export { authentificationController };
