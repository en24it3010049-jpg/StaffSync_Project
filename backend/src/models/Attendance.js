const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateKey: { type: String, required: true },
  checkIn: { type: Date, default: Date.now },
  checkOut: { type: Date, default: null }
}, { timestamps: true });

attendanceSchema.index({ employee: 1, dateKey: 1 }, { unique: true });
module.exports = mongoose.model('Attendance', attendanceSchema);
