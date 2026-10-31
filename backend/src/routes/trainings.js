const router = require('express').Router();
const Training = require('../models/Training');
const { protect, allowRoles } = require('../middleware/auth');
router.use(protect);

router.get('/', async (req, res) => {
  try { res.json(await Training.find().sort({ date: 1 })); }
  catch (err) { res.status(500).json({ message: 'Could not load trainings' }); }
});

router.post('/', allowRoles('HR', 'Manager'), async (req, res) => {
  try {
    const { title, description, date, seats } = req.body;
    if (!title) return res.status(400).json({ message: 'Training title is required' });
    const item = await Training.create({ title, description, date: date || undefined, seats: seats || 30 });
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ message: 'Could not create training' }); }
});

router.post('/:id/enroll', async (req, res) => {
  try {
    const item = await Training.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Training not found' });
    if (item.enrolledUsers.some(id => String(id) === String(req.user._id))) return res.status(409).json({ message: 'Already enrolled' });
    if (item.enrolledUsers.length >= item.seats) return res.status(400).json({ message: 'No seats available' });
    item.enrolledUsers.push(req.user._id);
    await item.save();
    res.json(item);
  } catch (err) { res.status(400).json({ message: 'Could not enroll' }); }
});

module.exports = router;
