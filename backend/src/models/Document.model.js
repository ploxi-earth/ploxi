const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
    {
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

        name: { type: String, required: true, trim: true },
        description: { type: String },
        type: {
            type: String,
            enum: ['agreement', 'certificate', 'report', 'invoice', 'other'],
            default: 'other',
        },

        status: {
            type: String,
            enum: ['draft', 'shared', 'signed', 'archived'],
            default: 'shared',
        },

        sharedBy: {
            type: String,
            enum: ['admin', 'vendor'],
            default: 'admin',
        },

        fileUrl: { type: String }, // optional — can be external link
        notes: { type: String },
    },
    { timestamps: true }
);

documentSchema.index({ vendor: 1, type: 1 });

module.exports = mongoose.model('Document', documentSchema);
