const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3
  },
  age: {
    type: Number,
    min: 18,
    max: 100
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  photoUrl: {
    type: String,
    default: "https://media.licdn.com/dms/image/v2/C4D0BAQFb5GfbQYP9Ug/company-logo_200_200/company-logo_200_200/0/1647622611314/fso_onsite_outsourcing_logo?e=1755734400&v=beta&t=dozmE_oLZXDj-NxaLq3QrpAk6JUwsdywLX1J7oSZTIQ"
  },
  about: {
    type: String,
    default: "Hey there! I'm on DevTinder"
  },
  skills: {
    type: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
