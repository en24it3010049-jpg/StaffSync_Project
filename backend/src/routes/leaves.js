const router = require('express').Router();
const Leave = require('../models/Leave');
const { protect, allowRoles } = require('../middleware/auth');
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const query = req.user.role === 'Employee' ? { employee: req.user._id } : {};
    const items = await Leave.find(query).populate('employee', 'name email department').populate('reviewedBy', 'name').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: 'Could not load leave requests' }); }
});

router.post('/', async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    if (!startDate || !endDate || !reason) return res.status(400).json({ message: 'Dates and reason are required' });
    if (new Date(endDate) < new Date(startDate)) return res.status(400).json({ message: 'End date must be on or after start date' });
    const item = await Leave.create({ employee: req.user._id, leaveType, startDate, endDate, reason });
    res.status(201).json(await item.populate('employee', 'name email department'));
  } catch (err) { res.status(400).json({ message: 'Could not submit leave request' }); }
});

router.patch('/:id/status', allowRoles('HR', 'Manager'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) return res.status(400).json({ message: 'Status must be Approved or Rejected' });
    const item = await Leave.findByIdAndUpdate(req.params.id, { status, reviewedBy: req.user._id }, { new: true })
      .populate('employee', 'name email department').populate('reviewedBy', 'name');
    if (!item) return res.status(404).json({ message: 'Leave request not found' });
    res.json(item);
  } catch (err) { res.status(400).json({ message: 'Could not update leave request' }); }
});

module.exports = router;
