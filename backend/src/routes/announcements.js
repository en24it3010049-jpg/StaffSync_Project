const router = require('express').Router();
const Announcement = require('../models/Announcement');
const { protect, allowRoles } = require('../middleware/auth');
router.use(protect);

router.get('/', async (req, res) => {
  try {
    res.json(await Announcement.find().populate('author', 'name').sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ message: 'Could not load announcements' }); }
});

router.post('/', allowRoles('HR'), async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) return res.status(400).json({ message: 'Title and message are required' });
    const item = await Announcement.create({ title, body, author: req.user._id });
    res.status(201).json(await item.populate('author', 'name'));
  } catch (err) { res.status(400).json({ message: 'Could not publish announcement' }); }
});

module.exports = router;
