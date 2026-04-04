const supabase = require('../config/db');
const AppError = require('../utils/AppError');

// ── Helper: get vendor ID for current user ─────────────────────────────────
const getVendorId = (req) => {
  return req.user.vendorId || req.user._id;
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  PORTAL DASHBOARD                                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
exports.getDashboardStats = async (req, res, next) => {
  const vendorId = getVendorId(req);

  const [
    { count: totalServices },
    { count: activeServices },
    { count: totalProjects },
    { count: activeProjects },
    { count: completedProjects },
    { count: unreadNotifications },
  ] = await Promise.all([
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('vendor_id', vendorId),
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('vendor_id', vendorId).eq('status', 'active'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('vendor_id', vendorId),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('vendor_id', vendorId).in('status', ['opportunity', 'proposal', 'in_progress']),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('vendor_id', vendorId).eq('status', 'completed'),
    supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', req.user._id).eq('is_read', false),
  ]);

  // Calculate total revenue from completed projects
  const { data: completedProjectsData } = await supabase
    .from('projects')
    .select('value')
    .eq('vendor_id', vendorId)
    .eq('status', 'completed');

  const totalRevenue = (completedProjectsData || []).reduce((sum, p) => sum + (Number(p.value) || 0), 0);

  // Recent activity
  const [{ data: recentProjects }, { data: recentNotifications }] = await Promise.all([
    supabase.from('projects').select('*').eq('vendor_id', vendorId).order('updated_at', { ascending: false }).limit(5),
    supabase.from('notifications').select('*').eq('user_id', req.user._id).order('created_at', { ascending: false }).limit(5),
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalServices: totalServices || 0,
        activeServices: activeServices || 0,
        totalProjects: totalProjects || 0,
        activeProjects: activeProjects || 0,
        completedProjects: completedProjects || 0,
        totalRevenue,
        unreadNotifications: unreadNotifications || 0,
      },
      recentProjects: recentProjects || [],
      recentNotifications: recentNotifications || [],
    },
  });
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  SERVICES                                                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
exports.getServices = async (req, res) => {
  const vendorId = getVendorId(req);
  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  res.json({ success: true, data: services || [] });
};

exports.createService = async (req, res) => {
  const vendorId = getVendorId(req);
  const { name, description, category, sector, tags, status, pricing, deliveryTimeline, coverImage } = req.body;

  const { data: service, error } = await supabase
    .from('services')
    .insert({
      vendor_id: vendorId,
      user_id: req.user._id,
      name,
      description,
      category,
      sector,
      tags: tags || [],
      status: status || 'active',
      pricing,
      delivery_timeline: deliveryTimeline,
      cover_image: coverImage,
    })
    .select()
    .single();

  if (error) throw error;
  res.status(201).json({ success: true, data: service });
};

exports.updateService = async (req, res, next) => {
  const vendorId = getVendorId(req);
  const updates = {};

  const fieldMap = {
    name: 'name', description: 'description', category: 'category',
    sector: 'sector', tags: 'tags', status: 'status', pricing: 'pricing',
    deliveryTimeline: 'delivery_timeline', coverImage: 'cover_image',
  };

  for (const [camel, snake] of Object.entries(fieldMap)) {
    if (req.body[camel] !== undefined) updates[snake] = req.body[camel];
  }
  updates.updated_at = new Date().toISOString();

  const { data: service, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', req.params.id)
    .eq('vendor_id', vendorId)
    .select()
    .single();

  if (error || !service) return next(new AppError('Service not found.', 404));
  res.json({ success: true, data: service });
};

exports.deleteService = async (req, res, next) => {
  const vendorId = getVendorId(req);
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', req.params.id)
    .eq('vendor_id', vendorId);

  if (error) return next(new AppError('Service not found.', 404));
  res.json({ success: true, message: 'Service deleted.' });
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  PROJECTS                                                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
exports.getProjects = async (req, res) => {
  const vendorId = getVendorId(req);
  const { status } = req.query;

  let query = supabase.from('projects').select('*').eq('vendor_id', vendorId);
  if (status) query = query.eq('status', status);

  const { data: projects, error } = await query.order('updated_at', { ascending: false });
  if (error) throw error;
  res.json({ success: true, data: projects || [] });
};

exports.createProject = async (req, res) => {
  const vendorId = getVendorId(req);
  const { title, description, client, value, status, startDate, endDate, progress, sector, notes } = req.body;

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      vendor_id: vendorId,
      user_id: req.user._id,
      title,
      description,
      client,
      value: value || 0,
      status: status || 'opportunity',
      start_date: startDate || null,
      end_date: endDate || null,
      progress: progress || 0,
      sector,
      notes,
    })
    .select()
    .single();

  if (error) throw error;
  res.status(201).json({ success: true, data: project });
};

exports.updateProject = async (req, res, next) => {
  const vendorId = getVendorId(req);
  const updates = {};

  const fieldMap = {
    title: 'title', description: 'description', client: 'client',
    value: 'value', status: 'status', startDate: 'start_date',
    endDate: 'end_date', progress: 'progress', sector: 'sector', notes: 'notes',
  };

  for (const [camel, snake] of Object.entries(fieldMap)) {
    if (req.body[camel] !== undefined) updates[snake] = req.body[camel];
  }
  updates.updated_at = new Date().toISOString();

  const { data: project, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', req.params.id)
    .eq('vendor_id', vendorId)
    .select()
    .single();

  if (error || !project) return next(new AppError('Project not found.', 404));
  res.json({ success: true, data: project });
};

exports.deleteProject = async (req, res, next) => {
  const vendorId = getVendorId(req);
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', req.params.id)
    .eq('vendor_id', vendorId);

  if (error) return next(new AppError('Project not found.', 404));
  res.json({ success: true, message: 'Project deleted.' });
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  MEETINGS (from meetings table)                                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
exports.getMeetings = async (req, res) => {
  const vendorId = getVendorId(req);

  const { data: meetings, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Format meetings to match expected shape
  const formatted = (meetings || []).map(m => ({
    _id: m.id,
    type: 'Onboarding Meeting',
    date: m.scheduled_date,
    time: m.scheduled_time,
    link: m.meeting_link,
    note: m.notes,
    status: m.scheduled_date && new Date(m.scheduled_date) > new Date() ? 'upcoming' : 'completed',
    scheduledAt: m.created_at,
  }));

  res.json({ success: true, data: formatted });
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  NOTIFICATIONS                                                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
exports.getNotifications = async (req, res) => {
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', req.user._id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', req.user._id)
    .eq('is_read', false);

  res.json({ success: true, data: notifications || [], unreadCount: unreadCount || 0 });
};

exports.markNotificationRead = async (req, res, next) => {
  const { data: notif, error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('user_id', req.user._id)
    .select()
    .single();

  if (error || !notif) return next(new AppError('Notification not found.', 404));
  res.json({ success: true, data: notif });
};

exports.markAllNotificationsRead = async (req, res) => {
  await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', req.user._id)
    .eq('is_read', false);

  res.json({ success: true, message: 'All notifications marked as read.' });
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  SETTINGS                                                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
exports.updateSettings = async (req, res) => {
  const vendorId = getVendorId(req);
  const { contactPerson, phone, email } = req.body;

  const vendorUpdates = {};
  if (contactPerson) vendorUpdates.contact_person = contactPerson;
  if (phone) vendorUpdates.phone = phone;
  if (email) vendorUpdates.email = email.toLowerCase().trim();

  if (Object.keys(vendorUpdates).length > 0) {
    await supabase.from('vendors').update(vendorUpdates).eq('id', vendorId);
  }

  // Also update user name if contactPerson changed
  if (contactPerson) {
    await supabase.from('users').update({ name: contactPerson }).eq('id', vendorId);
  }

  const { data: vendor } = await supabase.from('vendors').select('*').eq('id', vendorId).single();
  res.json({ success: true, data: vendor });
};
