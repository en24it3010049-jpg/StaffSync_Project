const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, allowRoles } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const filter = req.user.role === 'HR' ? {} : { active: true };
    const employees = await User.find(filter).select('-password').sort({ name: 1 });
    res.json(employees);
  } catch (err) { res.status(500).json({ message: 'Could not load employees' }); }
});

router.post('/', allowRoles('HR'), async (req, res) => {
  try {
    const { name, email, password, role, department, jobTitle, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    const user = await User.create({
      name, email, password: await bcrypt.hash(password, 12),
      role: ['HR', 'Manager', 'Employee'].includes(role) ? role : 'Employee',
      department, jobTitle, phone
    });
    const result = user.toObject(); delete result.password;
    res.status(201).json(result);
  } catch (err) {
    res.status(err.code === 11000 ? 409 : 400).json({ message: err.code === 11000 ? 'Email already exists' : 'Could not create employee' });
  }
});

router.put('/:id', allowRoles('HR'), async (req, res) => {
  try {
    const allowed = ['name', 'email', 'role', 'department', 'jobTitle', 'phone', 'active'];
    const update = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Employee not found' });
    res.json(user);
  } catch (err) { res.status(400).json({ message: 'Could not update employee' }); }
});

router.delete('/:id', allowRoles('HR'), async (req, res) => {
  if (String(req.user._id) === req.params.id) return res.status(400).json({ message: 'You cannot delete your own account' });
  const user = await User.findByIdAndUpdate(req.params.id, { active: false }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'Employee not found' });
  res.json({ message: 'Employee deactivated' });
});

module.exports = router;
