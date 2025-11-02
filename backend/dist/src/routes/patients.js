"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const patient_model_1 = require("../models/patient.model");
const router = (0, express_1.Router)();
// List patients for current physiotherapist
router.get('/', auth_1.requireAuth, async (req, res) => {
    try {
        const requester = req.user;
        if (requester.role !== 'Physiotherapist') {
            return res.status(403).json({ error: 'Only physiotherapists can access patients' });
        }
        const patients = await patient_model_1.Patient.find({ physioId: requester.id }).sort({ createdAt: -1 });
        return res.json({ patients });
    }
    catch (error) {
        console.error('Error fetching patients:', error);
        return res.status(500).json({ error: 'Failed to fetch patients' });
    }
});
// Create new patient for current physiotherapist
router.post('/', auth_1.requireAuth, async (req, res) => {
    try {
        const requester = req.user;
        if (requester.role !== 'Physiotherapist') {
            return res.status(403).json({ error: 'Only physiotherapists can create patients' });
        }
        const { name, details = '', severity } = req.body || {};
        if (!name || !severity || !['small', 'middle', 'severe'].includes(severity)) {
            return res.status(400).json({ error: 'Invalid patient payload' });
        }
        const patient = await patient_model_1.Patient.create({ name, details, severity, physioId: requester.id });
        return res.status(201).json({ patient });
    }
    catch (error) {
        console.error('Error creating patient:', error);
        return res.status(500).json({ error: 'Failed to create patient' });
    }
});
// Update patient owned by current physiotherapist
router.put('/:id', auth_1.requireAuth, async (req, res) => {
    try {
        const requester = req.user;
        if (requester.role !== 'Physiotherapist') {
            return res.status(403).json({ error: 'Only physiotherapists can update patients' });
        }
        const { id } = req.params;
        const updates = {};
        const { name, details, severity } = req.body || {};
        if (name !== undefined)
            updates.name = name;
        if (details !== undefined)
            updates.details = details;
        if (severity !== undefined) {
            if (!['small', 'middle', 'severe'].includes(severity)) {
                return res.status(400).json({ error: 'Invalid severity value' });
            }
            updates.severity = severity;
        }
        const patient = await patient_model_1.Patient.findOneAndUpdate({ _id: id, physioId: requester.id }, { $set: updates }, { new: true });
        if (!patient)
            return res.status(404).json({ error: 'Patient not found' });
        return res.json({ patient });
    }
    catch (error) {
        console.error('Error updating patient:', error);
        return res.status(500).json({ error: 'Failed to update patient' });
    }
});
// Delete patient owned by current physiotherapist
router.delete('/:id', auth_1.requireAuth, async (req, res) => {
    try {
        const requester = req.user;
        if (requester.role !== 'Physiotherapist') {
            return res.status(403).json({ error: 'Only physiotherapists can delete patients' });
        }
        const { id } = req.params;
        const patient = await patient_model_1.Patient.findOneAndDelete({ _id: id, physioId: requester.id });
        if (!patient)
            return res.status(404).json({ error: 'Patient not found' });
        return res.json({ message: 'Patient removed' });
    }
    catch (error) {
        console.error('Error deleting patient:', error);
        return res.status(500).json({ error: 'Failed to delete patient' });
    }
});
exports.default = router;
//# sourceMappingURL=patients.js.map