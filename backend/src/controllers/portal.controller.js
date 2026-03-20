const Service = require('../models/Service.model');
const Project = require('../models/Project.model');
const Document = require('../models/Document.model');
const Notification = require('../models/Notification.model');
const Vendor = require('../models/Vendor.model');
const AppError = require('../utils/AppError');

// ── Helper: get vendor for current user ────────────────────────────────────
const getVendor = async (userId) => {
    const vendor = await Vendor.findOne({ user: userId });
    if (!vendor) throw new AppError('Vendor profile not found.', 404);
    return vendor;
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  PORTAL DASHBOARD                                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
exports.getDashboardStats = async (req, res, next) => {
    const vendor = await getVendor(req.user._id);

    const [
        totalServices,
        activeServices,
        totalProjects,
        activeProjects,
        completedProjects,
        totalDocs,
        unreadNotifications,
    ] = await Promise.all([
        Service.countDocuments({ vendor: vendor._id }),
        Service.countDocuments({ vendor: vendor._id, status: 'active' }),
        Project.countDocuments({ vendor: vendor._id }),
        Project.countDocuments({ vendor: vendor._id, status: { $in: ['opportunity', 'proposal', 'in_progress'] } }),
        Project.countDocuments({ vendor: vendor._id, status: 'completed' }),
        Document.countDocuments({ vendor: vendor._id }),
        Notification.countDocuments({ user: req.user._id, isRead: false }),
    ]);

    // Calculate total revenue from completed projects
    const revenueResult = await Project.aggregate([
        { $match: { vendor: vendor._id, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$value' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Recent activity
    const [recentProjects, recentNotifications] = await Promise.all([
        Project.find({ vendor: vendor._id }).sort({ updatedAt: -1 }).limit(5).lean(),
        Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    res.json({
        success: true,
        data: {
            stats: {
                totalServices,
                activeServices,
                totalProjects,
                activeProjects,
                completedProjects,
                totalRevenue,
                totalDocs,
                unreadNotifications,
            },
            recentProjects,
            recentNotifications,
        },
    });
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  SERVICES                                                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
exports.getServices = async (req, res) => {
    const vendor = await getVendor(req.user._id);
    const services = await Service.find({ vendor: vendor._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: services });
};

exports.createService = async (req, res) => {
    const vendor = await getVendor(req.user._id);
    const service = await Service.create({
        ...req.body,
        vendor: vendor._id,
        user: req.user._id,
    });
    res.status(201).json({ success: true, data: service });
};

exports.updateService = async (req, res, next) => {
    const vendor = await getVendor(req.user._id);
    const service = await Service.findOneAndUpdate(
        { _id: req.params.id, vendor: vendor._id },
        req.body,
        { new: true, runValidators: true }
    );
    if (!service) return next(new AppError('Service not found.', 404));
    res.json({ success: true, data: service });
};

exports.deleteService = async (req, res, next) => {
    const vendor = await getVendor(req.user._id);
    const service = await Service.findOneAndDelete({ _id: req.params.id, vendor: vendor._id });
    if (!service) return next(new AppError('Service not found.', 404));
    res.json({ success: true, message: 'Service deleted.' });
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  PROJECTS                                                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
exports.getProjects = async (req, res) => {
    const vendor = await getVendor(req.user._id);
    const { status } = req.query;
    const filter = { vendor: vendor._id };
    if (status) filter.status = status;
    const projects = await Project.find(filter).sort({ updatedAt: -1 });
    res.json({ success: true, data: projects });
};

exports.createProject = async (req, res) => {
    const vendor = await getVendor(req.user._id);
    const project = await Project.create({
        ...req.body,
        vendor: vendor._id,
        user: req.user._id,
    });
    res.status(201).json({ success: true, data: project });
};

exports.updateProject = async (req, res, next) => {
    const vendor = await getVendor(req.user._id);
    const project = await Project.findOneAndUpdate(
        { _id: req.params.id, vendor: vendor._id },
        req.body,
        { new: true, runValidators: true }
    );
    if (!project) return next(new AppError('Project not found.', 404));
    res.json({ success: true, data: project });
};

exports.deleteProject = async (req, res, next) => {
    const vendor = await getVendor(req.user._id);
    const project = await Project.findOneAndDelete({ _id: req.params.id, vendor: vendor._id });
    if (!project) return next(new AppError('Project not found.', 404));
    res.json({ success: true, message: 'Project deleted.' });
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  MEETINGS (from Vendor model data)                                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
exports.getMeetings = async (req, res) => {
    const vendor = await getVendor(req.user._id);
    // Extract meeting info from onboarding history + vendor fields
    const meetings = [];

    if (vendor.meetingDate) {
        meetings.push({
            _id: 'intro-meeting',
            type: 'Intro Meeting',
            date: vendor.meetingDate,
            time: vendor.meetingTime,
            link: vendor.meetingLink,
            note: vendor.meetingNote,
            status: new Date(vendor.meetingDate) > new Date() ? 'upcoming' : 'completed',
        });
    }

    // Build from onboarding history entries
    const meetingEntries = (vendor.onboardingHistory || [])
        .filter((h) => h.stage === 'intro_meeting_scheduled')
        .map((h) => ({
            _id: h._id,
            type: 'Onboarding Meeting',
            date: vendor.meetingDate,
            time: vendor.meetingTime,
            link: vendor.meetingLink,
            note: h.note,
            status: 'completed',
            scheduledAt: h.updatedAt,
        }));

    res.json({ success: true, data: meetings.length ? meetings : meetingEntries });
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  DOCUMENTS                                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
exports.getDocuments = async (req, res) => {
    const vendor = await getVendor(req.user._id);
    const docs = await Document.find({ vendor: vendor._id }).sort({ createdAt: -1 });

    // Also include agreement status from vendor model as a virtual document
    const allDocs = [...docs];
    if (vendor.agreementStatus && vendor.agreementStatus !== 'not_sent') {
        allDocs.unshift({
            _id: 'partnership-agreement',
            name: 'Partnership Agreement',
            type: 'agreement',
            status: vendor.agreementStatus === 'signed' ? 'signed' : 'shared',
            sharedBy: 'admin',
            createdAt: vendor.agreementSentAt,
            updatedAt: vendor.agreementSignedAt || vendor.agreementSentAt,
            notes: vendor.agreementStatus === 'signed' ? 'Agreement signed and confirmed' : 'Pending signature',
        });
    }

    res.json({ success: true, data: allDocs });
};

exports.createDocument = async (req, res) => {
    const vendor = await getVendor(req.user._id);
    const doc = await Document.create({
        ...req.body,
        vendor: vendor._id,
        user: req.user._id,
        sharedBy: 'vendor',
    });
    res.status(201).json({ success: true, data: doc });
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  NOTIFICATIONS                                                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
exports.getNotifications = async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50);
    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
    res.json({ success: true, data: notifications, unreadCount });
};

exports.markNotificationRead = async (req, res, next) => {
    const notif = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { isRead: true, readAt: Date.now() },
        { new: true }
    );
    if (!notif) return next(new AppError('Notification not found.', 404));
    res.json({ success: true, data: notif });
};

exports.markAllNotificationsRead = async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, isRead: false },
        { isRead: true, readAt: Date.now() }
    );
    res.json({ success: true, message: 'All notifications marked as read.' });
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  SETTINGS                                                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
exports.updateSettings = async (req, res) => {
    const vendor = await getVendor(req.user._id);
    const { contactPerson, phone, email } = req.body;
    if (contactPerson) vendor.contactPerson = contactPerson;
    if (phone) vendor.phone = phone;
    if (email) vendor.email = email;
    await vendor.save();

    // Also update user name if contactPerson changed
    if (contactPerson) {
        const User = require('../models/User.model');
        await User.findByIdAndUpdate(req.user._id, { name: contactPerson });
    }

    res.json({ success: true, data: vendor });
};
