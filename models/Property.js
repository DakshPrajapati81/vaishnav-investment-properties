/* ============================================
   VAISHNAV INVESTMENT & PROPERTIES
   Mongoose Property Model
   ============================================ */

const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['For Sale', 'For Rent', 'Buy'],
    default: 'For Sale'
  },
  type: {
    type: String,
    required: true,
    enum: ['Apartment', 'Villa', 'Commercial', 'Builder Floor', 'Plot', 'Penthouse'],
    default: 'Apartment'
  },
  price: {
    type: String,
    required: [true, 'Price is required'],
    trim: true
  },
  area: {
    type: String,
    required: [true, 'Area is required'],
    trim: true
  },
  bedrooms: {
    type: Number,
    default: 0,
    min: 0
  },
  bathrooms: {
    type: Number,
    default: 0,
    min: 0
  },
  image: {
    type: String,
    default: 'assets/images/property-apartment.png'
  },
  gallery: {
    type: [String],
    default: []
  },
  featured: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ''
  },
  highlights: {
    type: [String],
    default: []
  },
  amenities: {
    type: [String],
    default: []
  },
  projectArea: {
    type: String,
    default: ''
  },
  floors: {
    type: Number,
    default: 0
  },
  units: {
    type: Number,
    default: 0
  },
  configurations: {
    type: String,
    default: ''
  },
  possessionStatus: {
    type: String,
    default: 'Ready to Move'
  },
  address: {
    type: String,
    default: ''
  },
  pincode: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Add text index for search
propertySchema.index({ title: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Property', propertySchema);
