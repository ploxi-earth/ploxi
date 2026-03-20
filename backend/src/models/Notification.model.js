const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },

        type: {
            type: String,
            enum: ['info', 'success', 'warning', 'action', 'system'],
            default: 'info',
        },

        title: { type: String, required: true },
        message: { type: String, required: true },
        link: { type: String }, // optional action URL

        isRead: { type: Boolean, default: false },
        readAt: Date,
    },
    { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
