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

export const getaAssistanceCount = async (req, res) => {
    try {
        const count = await AssistanceModel.countDocuments();
        return res.status(200).json({ count });
    } catch (err) {
        console.error("Erreur lors de la récupération des assistances en attente:", err);
        return res.status(500).json({ error: "Erreur lors de la récupération des assistances en attente" });
    }
};

const getAssistance = async (req, res) => {
    try {
        const assistanceRequests = await AssistanceModel.find({})
        .populate('clientId')  
        .populate({
          path: 'responses.sender',
          select: 'name email'  
        })
        .populate({
          path: 'actions.performedBy',
          select: 'name email'  
        });
      
        return res.status(200).json({ success: true, data: assistanceRequests });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const getMyAssistance = async (req, res) => {
    try {
        // Extract user ID from the decoded token (assuming you've decoded the token earlier in middleware)
        const { id } = req.params;
        console.log(id)
        // Fetch assistance requests for the authenticated user
        const assistanceRequests = await AssistanceModel.find({ clientId: id})
            .populate({
                path: 'responses.sender',
                select: 'name email'  // Populate sender's name and email
            })
            .populate({
                path: 'actions.performedBy',
                select: 'name email'  // Populate performedBy's name and email
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
    const { status, messages = [], sender } = req.body; // Expect an array of message objects with message and sender

    try {
        // Find the assistance document by ID
        const assistance = await AssistanceModel.findById(id);
        if (!assistance) {
            return res.status(404).json({ success: false, message: "Assistance request not found" });
        }

        let actionLogs = [];

        // Update the status if provided and it's different from the current status
        if (status && status !== assistance.status) {
            actionLogs.push({
                actionType: 'status_update',
                performedBy: sender,
                metadata: { oldStatus: assistance.status, newStatus: status }
            });
            assistance.status = status; // Update the status
        }

        // Handle an array of message objects
        if (Array.isArray(messages) && messages.length > 0) {
            messages.forEach(({ message }) => {
                if (message && sender) {
                    // Add each message to the responses array
                    assistance.responses.push({
                        sender,
                        message,
                        timestamp: new Date()
                    });

                    // Log the action for each message
                    actionLogs.push({
                        actionType: 'response_sent',
                        performedBy: sender,
                        metadata: { message }
                    });
                }
            });
        }

        // Add the action logs to the actions array, if any actions were logged
        if (actionLogs.length > 0) {
            assistance.actions.push(...actionLogs);
        }

        // Save the updated assistance document
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
    getMyAssistance,
    updateAssistance
};

export { assistanceController };
