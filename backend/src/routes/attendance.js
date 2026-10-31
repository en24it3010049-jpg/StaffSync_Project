const router = require('express').Router();
const Attendance = require('../models/Attendance');
const { protect, allowRoles } = require('../middleware/auth');
router.use(protect);

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

router.get('/', async (req, res) => {
  try {
    const query = req.user.role === 'Employee' ? { employee: req.user._id } : {};
    const items = await Attendance.find(query).populate('employee', 'name department').sort({ createdAt: -1 }).limit(100);
    res.json(items);
  } catch (err) { res.status(500).json({ message: 'Could not load attendance' }); }
});

router.post('/', async (req, res) => {
  try {
    const item = await Attendance.create({ employee: req.user._id, dateKey: todayKey(), checkIn: new Date() });
    res.status(201).json(await item.populate('employee', 'name department'));
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'You have already checked in today' });
    res.status(400).json({ message: 'Could not check in' });
  }
});

router.post('/check-out', async (req, res) => {
  try {
    const item = await Attendance.findOne({ employee: req.user._id, dateKey: todayKey(), checkOut: null });
    if (!item) return res.status(404).json({ message: 'No open check-in found for today' });
    item.checkOut = new Date();
    await item.save();
    res.json(item);
  } catch (err) { res.status(400).json({ message: 'Could not check out' }); }
});

module.exports = router;
