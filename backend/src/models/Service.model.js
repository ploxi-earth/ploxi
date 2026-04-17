const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

        name: { type: String, required: true, trim: true },
        description: { type: String, maxlength: 2000 },
        category: { type: String, trim: true },
        sector: { type: String, trim: true },
        tags: [{ type: String, trim: true }],

        status: {
            type: String,
            enum: ['active', 'inactive', 'draft'],
            default: 'active',
        },

        deliveryTimeline: { type: String, trim: true },
        coverImage: { type: String },
    },
    { timestamps: true }
);

serviceSchema.index({ vendor: 1, status: 1 });

module.exports = mongoose.model('Service', serviceSchema);
