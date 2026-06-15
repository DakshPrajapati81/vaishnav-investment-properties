/* ============================================
   VAISHNAV INVESTMENT & PROPERTIES
   Property API Routes
   ============================================ */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Property = require('../models/Property');
const authMiddleware = require('../middleware/auth');

/* ---------- Multer Config for Image Uploads ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'property-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP and GIF images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// Upload fields: main image + up to 5 gallery images
const uploadFields = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 5 }
]);

/* ---------- GET /api/properties ---------- */
// Get all properties with optional filters
router.get('/', async (req, res) => {
  try {
    const { location, status, type, featured, search } = req.query;
    let filter = {};

    if (location && location !== 'all') {
      filter.location = location;
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (type && type !== 'all') {
      filter.type = type;
    }
    if (featured === 'true') {
      filter.featured = true;
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

/* ---------- GET /api/properties/:id ---------- */
// Get single property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    console.error('Error fetching property:', err);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

/* ---------- POST /api/properties ---------- */
// Create a new property
router.post('/', authMiddleware, uploadFields, async (req, res) => {
  try {
    const data = req.body;

    // Handle main image
    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      data.image = '/uploads/' + req.files.mainImage[0].filename;
    }

    // Handle gallery images
    if (req.files && req.files.galleryImages) {
      data.gallery = req.files.galleryImages.map(f => '/uploads/' + f.filename);
    }

    // Parse JSON fields if they come as strings
    if (typeof data.highlights === 'string') {
      try { data.highlights = JSON.parse(data.highlights); } catch (e) { data.highlights = []; }
    }
    if (typeof data.amenities === 'string') {
      try { data.amenities = JSON.parse(data.amenities); } catch (e) { data.amenities = []; }
    }
    if (typeof data.gallery === 'string') {
      try { data.gallery = JSON.parse(data.gallery); } catch (e) { data.gallery = []; }
    }

    // Parse numeric fields
    if (data.bedrooms) data.bedrooms = parseInt(data.bedrooms) || 0;
    if (data.bathrooms) data.bathrooms = parseInt(data.bathrooms) || 0;
    if (data.floors) data.floors = parseInt(data.floors) || 0;
    if (data.units) data.units = parseInt(data.units) || 0;
    if (data.featured) data.featured = data.featured === 'true' || data.featured === true;

    const property = new Property(data);
    await property.save();

    res.status(201).json(property);
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(400).json({ error: err.message || 'Failed to create property' });
  }
});

/* ---------- PUT /api/properties/:id ---------- */
// Update a property
router.put('/:id', authMiddleware, uploadFields, async (req, res) => {
  try {
    const data = req.body;

    // Handle new main image upload
    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      data.image = '/uploads/' + req.files.mainImage[0].filename;
    }

    // Handle new gallery images
    if (req.files && req.files.galleryImages) {
      const newGallery = req.files.galleryImages.map(f => '/uploads/' + f.filename);
      // Merge with existing gallery if provided
      if (data.existingGallery) {
        try {
          const existing = JSON.parse(data.existingGallery);
          data.gallery = [...existing, ...newGallery];
        } catch (e) {
          data.gallery = newGallery;
        }
        delete data.existingGallery;
      } else {
        data.gallery = newGallery;
      }
    }

    // Parse JSON fields
    if (typeof data.highlights === 'string') {
      try { data.highlights = JSON.parse(data.highlights); } catch (e) { /* keep as-is */ }
    }
    if (typeof data.amenities === 'string') {
      try { data.amenities = JSON.parse(data.amenities); } catch (e) { /* keep as-is */ }
    }

    // Parse numeric fields
    if (data.bedrooms) data.bedrooms = parseInt(data.bedrooms) || 0;
    if (data.bathrooms) data.bathrooms = parseInt(data.bathrooms) || 0;
    if (data.floors) data.floors = parseInt(data.floors) || 0;
    if (data.units) data.units = parseInt(data.units) || 0;
    if (data.featured !== undefined) data.featured = data.featured === 'true' || data.featured === true;

    const property = await Property.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (err) {
    console.error('Error updating property:', err);
    res.status(400).json({ error: err.message || 'Failed to update property' });
  }
});

/* ---------- DELETE /api/properties/:id ---------- */
// Delete a property
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Clean up uploaded images
    if (property.image && property.image.startsWith('/uploads/')) {
      const imgPath = path.join(__dirname, '..', property.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    if (property.gallery && property.gallery.length > 0) {
      property.gallery.forEach(img => {
        if (img.startsWith('/uploads/')) {
          const imgPath = path.join(__dirname, '..', img);
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }
      });
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

module.exports = router;
