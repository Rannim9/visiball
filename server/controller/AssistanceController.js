import { AssistanceModel } from '../models/Assistance.js';
import { validationResult } from 'express-validator';

const addAssistance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { clientId, serviceType, description } = req.body;

    console.log("Request body:", req.body);

    try {
        const newAssistance = new AssistanceModel({
            clientId,
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
        const assistanceRequests = await AssistanceModel.find({}).populate('clientId').populate({
            path: 'responses.sender', // Populate sender in responses
            select: 'name email', // Specify fields you want to retrieve from the User model
        });
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
    const { sender, message, status } = req.body;

    try {
        // Find the assistance document by ID
        const assistance = await AssistanceModel.findById(id);
        if (!assistance) {
            return res.status(404).json({ success: false, message: "Assistance request not found" });
        }

        // Update the status if provided
        if (status) {
            assistance.status = status;
        }

        // Add a new response if sender and message are provided
        if (sender && message) {
            assistance.responses.push({ sender, message, timestamp: new Date() });
        }

        // Save the updated document
        const updatedAssistance = await assistance.save();

        return res.status(200).json({ success: true, message: "Assistance request updated successfully", data: updatedAssistance });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

export default updateAssistance;


const assistanceController = {
    addAssistance,
    getAssistance,
    updateAssistance
};

export { assistanceController };
