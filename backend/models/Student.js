const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    course: {
        type: String,
        required: [true, 'Course is required'],
        trim: true
    },
    allowance: {
        type: Number,
        required: [true, 'Monthly allowance is required'],
        min: [0, 'Allowance cannot be negative']
    },
    yearlyAllowance: {
        type: Number
    }
}, {
    timestamps: true
});

// Pre-save hook: Calculates yearly allowance when creating a new student
studentSchema.pre('save', function() {
    // Only calculate if allowance exists and was changed
    if (this.isModified('allowance') && this.allowance !== undefined) {
        this.yearlyAllowance = this.allowance * 12;
    }
});

// Pre-update hook: Calculates yearly allowance when editing an existing student
studentSchema.pre('findOneAndUpdate', function() {
    const update = this.getUpdate();
    
    // Safely check if allowance is being updated
    if (update.allowance !== undefined) {
        // this.set() is the safest way to modify data in an update hook
        this.set({ yearlyAllowance: update.allowance * 12 });
    }
});

module.exports = mongoose.model('Student', studentSchema);