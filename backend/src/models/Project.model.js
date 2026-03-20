const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

        title: { type: String, required: true, trim: true },
        description: { type: String, maxlength: 2000 },
        client: { type: String, trim: true },
        value: { type: Number, default: 0 },

        status: {
            type: String,
            enum: ['opportunity', 'proposal', 'in_progress', 'completed', 'cancelled'],
            default: 'opportunity',
        },

        startDate: Date,
        endDate: Date,
        progress: { type: Number, min: 0, max: 100, default: 0 },

        sector: { type: String, trim: true },
        notes: { type: String, maxlength: 1000 },
    },
    { timestamps: true }
);

projectSchema.index({ vendor: 1, status: 1 });

module.exports = mongoose.model('Project', projectSchema);
