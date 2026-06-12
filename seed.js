/* ============================================
   VAISHNAV INVESTMENT & PROPERTIES
   Database Seed Script
   ============================================
   Run: node seed.js
   This imports the existing properties.json data into MongoDB
   ============================================ */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Property = require('./models/Property');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vaishnav-properties';

// Enhanced property data with additional fields for detail pages
const enhancedProperties = [
  {
    title: "Luxury 4BHK Apartment in Vasant Vihar",
    location: "Vasant Vihar",
    status: "For Sale",
    type: "Apartment",
    price: "₹3.5 Cr",
    area: "2400",
    bedrooms: 4,
    bathrooms: 3,
    image: "assets/images/property-apartment.png",
    gallery: [
      "assets/images/property-apartment.png",
      "assets/images/hero-bg.png",
      "assets/images/about-building.png"
    ],
    featured: true,
    description: "Spacious 4BHK apartment with modern interiors, Italian marble flooring, modular kitchen, and stunning city views. Located in one of Delhi's most prestigious neighborhoods. The apartment features premium fittings, large balconies with panoramic views, and is part of a gated community with world-class amenities.",
    highlights: [
      "Italian marble flooring throughout",
      "Modular kitchen with chimney and hob",
      "Stunning city views from all rooms",
      "Premium branded fittings and fixtures",
      "24/7 power backup and water supply"
    ],
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Power Backup", "Lift", "Club House", "Children's Play Area"],
    projectArea: "5.5 Acres",
    floors: 22,
    units: 180,
    configurations: "3, 4 BHK",
    possessionStatus: "Ready to Move",
    address: "Vasant Vihar, South Delhi",
    pincode: "110057"
  },
  {
    title: "Premium Villa with Private Pool",
    location: "Greater Kailash",
    status: "For Sale",
    type: "Villa",
    price: "₹8.2 Cr",
    area: "4500",
    bedrooms: 5,
    bathrooms: 5,
    image: "assets/images/property-villa.png",
    gallery: [
      "assets/images/property-villa.png",
      "assets/images/hero-bg.png",
      "assets/images/about-building.png"
    ],
    featured: true,
    description: "Exquisite independent villa featuring a private swimming pool, landscaped garden, home theater, and premium fixtures throughout. A true luxury living experience. The villa boasts a double-height living room, imported marble, and state-of-the-art smart home automation.",
    highlights: [
      "Private swimming pool with deck",
      "Landscaped garden with sit-out area",
      "Home theater with Dolby Atmos",
      "Smart home automation system",
      "Double-height living room with chandelier"
    ],
    amenities: ["Swimming Pool", "Garden", "Parking", "Security", "Power Backup", "Home Theater", "Servant Quarter", "Terrace"],
    projectArea: "500 sq.yd",
    floors: 3,
    units: 1,
    configurations: "5 BHK",
    possessionStatus: "Ready to Move",
    address: "Greater Kailash II, South Delhi",
    pincode: "110048"
  },
  {
    title: "Grade-A Office Space in Business Hub",
    location: "Connaught Place",
    status: "For Rent",
    type: "Commercial",
    price: "₹5 Lakh/month",
    area: "3500",
    bedrooms: 0,
    bathrooms: 2,
    image: "assets/images/property-commercial.png",
    gallery: [
      "assets/images/property-commercial.png",
      "assets/images/office.jpg",
      "assets/images/about-building.png"
    ],
    featured: false,
    description: "Premium office space in the heart of Delhi's commercial district. Features modern amenities, high-speed elevator access, 24/7 security, and ample parking. Ideal for corporates, startups, and co-working spaces looking for a prime address.",
    highlights: [
      "Prime location in Connaught Place",
      "High-speed elevators",
      "Central air conditioning",
      "Conference rooms available",
      "Cafeteria and pantry area"
    ],
    amenities: ["Parking", "Security", "Power Backup", "Lift", "CCTV", "Fire Safety", "Cafeteria", "Conference Room"],
    projectArea: "2 Acres",
    floors: 12,
    units: 96,
    configurations: "Office Suites",
    possessionStatus: "Ready to Move",
    address: "Connaught Place, Central Delhi",
    pincode: "110001"
  },
  {
    title: "Sky Penthouse with Panoramic Views",
    location: "South Delhi",
    status: "For Sale",
    type: "Apartment",
    price: "₹12 Cr",
    area: "5200",
    bedrooms: 5,
    bathrooms: 6,
    image: "assets/images/property-penthouse.png",
    gallery: [
      "assets/images/property-penthouse.png",
      "assets/images/hero-bg.png",
      "assets/images/about-building.png"
    ],
    featured: true,
    description: "Ultra-luxury penthouse spanning the top two floors with a private terrace, rooftop garden, and 360-degree city views. The pinnacle of urban living with exclusive access to premium amenities, private elevator, and concierge services.",
    highlights: [
      "360-degree panoramic city views",
      "Private terrace with rooftop garden",
      "Exclusive private elevator access",
      "Concierge and butler services",
      "Imported Italian kitchen and bathrooms"
    ],
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Power Backup", "Lift", "Concierge", "Rooftop Garden", "Jacuzzi"],
    projectArea: "8 Acres",
    floors: 45,
    units: 120,
    configurations: "4, 5 BHK",
    possessionStatus: "Ready to Move",
    address: "South Delhi, New Delhi",
    pincode: "110049"
  },
  {
    title: "Modern 3-Story Builder Floor",
    location: "Hauz Khas",
    status: "For Sale",
    type: "Builder Floor",
    price: "₹4.8 Cr",
    area: "3200",
    bedrooms: 4,
    bathrooms: 4,
    image: "assets/images/property-floor.png",
    gallery: [
      "assets/images/property-floor.png",
      "assets/images/hero-bg.png",
      "assets/images/about-building.png"
    ],
    featured: false,
    description: "Newly constructed builder floor with contemporary design, private entrance, dedicated parking, and premium finishes. Perfect for families seeking privacy and space in one of Delhi's most vibrant neighborhoods.",
    highlights: [
      "Independent private entrance",
      "Dedicated covered parking for 2 cars",
      "Contemporary architecture and design",
      "Terrace rights with sit-out area",
      "Close to Hauz Khas Village and metro"
    ],
    amenities: ["Parking", "Security", "Power Backup", "Terrace", "Modular Kitchen", "Wooden Flooring"],
    projectArea: "250 sq.yd",
    floors: 3,
    units: 1,
    configurations: "4 BHK",
    possessionStatus: "Ready to Move",
    address: "Hauz Khas, South Delhi",
    pincode: "110016"
  },
  {
    title: "Residential Plot in Gated Township",
    location: "Dwarka",
    status: "For Sale",
    type: "Plot",
    price: "₹2.1 Cr",
    area: "2000",
    bedrooms: 0,
    bathrooms: 0,
    image: "assets/images/property-plot.png",
    gallery: [
      "assets/images/property-plot.png",
      "assets/images/about-building.png"
    ],
    featured: false,
    description: "Prime residential plot in a well-planned gated community with wide roads, green belts, and excellent connectivity. Build your dream home from the ground up with complete freedom of design and architecture.",
    highlights: [
      "Well-planned gated community",
      "Wide internal roads with street lights",
      "Green belts and parks",
      "Excellent metro connectivity",
      "Close to schools, hospitals, and malls"
    ],
    amenities: ["Security", "Park", "Street Lighting", "Wide Roads", "Boundary Wall", "Water Supply"],
    projectArea: "50 Acres",
    floors: 0,
    units: 350,
    configurations: "200-500 sq.yd Plots",
    possessionStatus: "Ready to Move",
    address: "Dwarka, South West Delhi",
    pincode: "110077"
  },
  {
    title: "Furnished 2BHK for Professionals",
    location: "Saket",
    status: "For Rent",
    type: "Apartment",
    price: "₹45,000/month",
    area: "1200",
    bedrooms: 2,
    bathrooms: 2,
    image: "assets/images/property-apartment.png",
    gallery: [
      "assets/images/property-apartment.png",
      "assets/images/hero-bg.png"
    ],
    featured: false,
    description: "Fully furnished 2BHK apartment near Select Citywalk. Ideal for working professionals. Includes modular kitchen, AC, and geyser. Metro connectivity within walking distance. Well-maintained society with all modern amenities.",
    highlights: [
      "Fully furnished with modern furniture",
      "Walking distance to metro station",
      "Near Select Citywalk Mall",
      "Modular kitchen with appliances",
      "24/7 water and power supply"
    ],
    amenities: ["Parking", "Security", "Power Backup", "Lift", "Gym", "Park"],
    projectArea: "3 Acres",
    floors: 14,
    units: 200,
    configurations: "2, 3 BHK",
    possessionStatus: "Ready to Move",
    address: "Saket, South Delhi",
    pincode: "110017"
  },
  {
    title: "Commercial Showroom Space",
    location: "Lajpat Nagar",
    status: "For Rent",
    type: "Commercial",
    price: "₹3.5 Lakh/month",
    area: "2800",
    bedrooms: 0,
    bathrooms: 1,
    image: "assets/images/property-commercial.png",
    gallery: [
      "assets/images/property-commercial.png",
      "assets/images/office.jpg"
    ],
    featured: false,
    description: "Prime showroom space on the main road with high footfall. Ground floor access, large display windows, and ample parking. Perfect for retail businesses looking to establish presence in one of Delhi's busiest shopping areas.",
    highlights: [
      "Main road facing with high visibility",
      "Ground floor with direct access",
      "Large display windows for branding",
      "High footfall shopping area",
      "Ample customer parking available"
    ],
    amenities: ["Parking", "Security", "Power Backup", "CCTV", "Fire Safety", "Water Supply"],
    projectArea: "N/A",
    floors: 1,
    units: 1,
    configurations: "Showroom",
    possessionStatus: "Ready to Move",
    address: "Central Market, Lajpat Nagar, Delhi",
    pincode: "110024"
  },
  {
    title: "Elegant 3BHK in Premium Society",
    location: "Vasant Kunj",
    status: "For Sale",
    type: "Apartment",
    price: "₹2.8 Cr",
    area: "1950",
    bedrooms: 3,
    bathrooms: 3,
    image: "assets/images/property-apartment.png",
    gallery: [
      "assets/images/property-apartment.png",
      "assets/images/hero-bg.png",
      "assets/images/about-building.png"
    ],
    featured: false,
    description: "Well-maintained 3BHK in a reputed housing society. Features include a club house, swimming pool, gym, and 24/7 security. Close to international schools and malls. A perfect family home in a green, serene environment.",
    highlights: [
      "Reputed society with excellent maintenance",
      "Club house with multiple facilities",
      "Close to DPS and international schools",
      "Near Ambience Mall and airport",
      "Green and serene environment"
    ],
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Power Backup", "Lift", "Club House", "Children's Play Area", "Tennis Court"],
    projectArea: "12 Acres",
    floors: 18,
    units: 450,
    configurations: "2, 3, 4 BHK",
    possessionStatus: "Ready to Move",
    address: "Vasant Kunj, South Delhi",
    pincode: "110070"
  },
  {
    title: "Luxury Villa with Terrace Garden",
    location: "Chhatarpur",
    status: "For Rent",
    type: "Villa",
    price: "₹1.5 Lakh/month",
    area: "3800",
    bedrooms: 4,
    bathrooms: 4,
    image: "assets/images/property-villa.png",
    gallery: [
      "assets/images/property-villa.png",
      "assets/images/hero-bg.png",
      "assets/images/about-building.png"
    ],
    featured: false,
    description: "Beautiful independent villa with a rooftop terrace garden, spacious lawn, servant quarters, and car parking for 3 vehicles. Serene location away from city noise, perfect for families who want luxury living with nature.",
    highlights: [
      "Rooftop terrace with landscaped garden",
      "Spacious front and back lawns",
      "Servant quarters with separate entrance",
      "Parking for 3 vehicles",
      "Peaceful neighbourhood away from main road"
    ],
    amenities: ["Garden", "Parking", "Security", "Power Backup", "Servant Quarter", "Terrace", "Lawn", "CCTV"],
    projectArea: "400 sq.yd",
    floors: 3,
    units: 1,
    configurations: "4 BHK",
    possessionStatus: "Ready to Move",
    address: "Chhatarpur, South Delhi",
    pincode: "110074"
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if properties already exist
    const count = await Property.countDocuments();
    if (count > 0) {
      console.log(`⚠️  Database already has ${count} properties.`);
      console.log('   Do you want to clear and re-seed? Run: node seed.js --force');
      
      if (!process.argv.includes('--force')) {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        return;
      }
      
      console.log('🗑️  Clearing existing properties...');
      await Property.deleteMany({});
    }

    console.log('📦 Seeding properties...');
    const result = await Property.insertMany(enhancedProperties);
    console.log(`✅ Successfully seeded ${result.length} properties!`);
    
    // Print the IDs for reference
    result.forEach(p => {
      console.log(`   📌 ${p.title} → ID: ${p._id}`);
    });

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    console.log('\n🎉 Database seeding complete! Start the server with: npm start');
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
}

seedDatabase();
