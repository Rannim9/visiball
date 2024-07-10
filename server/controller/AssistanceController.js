import { AssistanceModel } from '../models/Assistance.js';
import { validationResult } from 'express-validator';

const addAssistance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { serviceType, description } = req.body;

    console.log("Request body:", req.body);

    try {
        const newAssistance = new AssistanceModel({
            serviceType, 
            description
        });

        await newAssistance.save();
        return res.status(201).json({ success: true, message: "Assistance ajoutée avec succès" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const getAssistance = async (req, res) => {
    try {
        const assistanceRequests = await AssistanceModel.find({});
        return res.status(200).json({ success: true, data: assistanceRequests });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const updateAssistance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedAssistance = await AssistanceModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedAssistance) {
            return res.status(404).json({ success: false, message: "Assistance request not found" });
        }
        return res.status(200).json({ success: true, message: "Assistance request updated successfully", data: updatedAssistance });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const assistanceController = {
    addAssistance,
    getAssistance,
    updateAssistance
};

export { assistanceController };
