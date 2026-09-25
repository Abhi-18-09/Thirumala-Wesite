export interface MenuItem {
  id: string;
  name: string;
  category: 'starters' | 'biryani' | 'non-veg' | 'veg' | 'snacks' | 'beverages' | 'desserts';
  isVeg: boolean;
  price: number;
  isPricePlaceholder?: boolean;
  description: string;
  popular?: boolean;
  spicyLevel?: 1 | 2 | 3;
  tag?: string;
  image?: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  mobile: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seatingPreference: 'Indoor' | 'Outdoor' | 'Any Available';
  specialRequests?: string;
  createdAt: string;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled';
}

export interface RestaurantSettings {
  name: string;
  legalEntityName: string;
  tagline: string;
  headline: string;
  subheadline: string;
  address: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  openTimeHour: number; // 24hr format
  openTimeMinute: number;
  closeTimeHour: number;
  closeTimeMinute: number;
  reservationDurationMinutes: number;
  maxGuestsPerBooking: number;
  totalTableCapacity: number;
  googleRating: number;
  reviewCount: number;
  legalNotice: string;
}

export const defaultRestaurantSettings: RestaurantSettings = {
  name: "Thirumala Bar and Restaurant",
  legalEntityName: "Thirumala Bar & Restaurant",
  tagline: "Food · Drinks · Good Times",
  headline: "Good Food. Great Company. Memorable Evenings.",
  subheadline: "A welcoming destination for hearty food, refreshing drinks, and relaxed dining in Bharamasagara.",
  address: "NH 48, Dyapanahalli Cross, Bharamasagara",
  landmark: "Near Bharamasagara Highway Toll & Service Corridor",
  city: "Bharamasagara",
  district: "Chitradurga",
  state: "Karnataka",
  pincode: "577519",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Thirumala+Bar+and+Restaurant+Bharmasagara+Chitradurga",
  googleMapsEmbedUrl: "https://maps.google.com/maps?q=14.3644,76.1775&hl=en&z=14&output=embed",
  phone: "+91 94480 52310",
  whatsapp: "919448052310",
  email: "reservations@thirumalarestaurant.in",
  openingHours: "10:30 AM – 11:00 PM (Monday – Sunday)",
  openTimeHour: 10,
  openTimeMinute: 30,
  closeTimeHour: 23,
  closeTimeMinute: 0,
  reservationDurationMinutes: 90,
  maxGuestsPerBooking: 16,
  totalTableCapacity: 80,
  googleRating: 3.9,
  reviewCount: 128,
  legalNotice: "Legal Advisory: In accordance with the Karnataka Excise Act and state laws, alcoholic beverages are strictly served only to patrons aged 21 and above. Valid government-issued photo identity proof is required upon request. Please consume responsibly. Drinking and driving is strictly prohibited."
};

export const initialMenuItems: MenuItem[] = [
  {
    id: "item-1",
    name: "Karnataka Chicken Pepper Fry",
    category: "starters",
    isVeg: false,
    price: 240,
    description: "Tender country chicken morsels dry-roasted with freshly cracked black peppercorns, curry leaves, and coastal spices.",
    popular: true,
    spicyLevel: 3,
    tag: "Signature Dish",
    image: "/src/assets/images/dish_chicken_pepper_fry_1790318074413.jpg"
  },
  {
    id: "item-2",
    name: "Thirumala Special Kasturi Kabab",
    category: "starters",
    isVeg: false,
    price: 260,
    description: "Succulent chicken marinated in aromatic Kasturi methi, roasted gram flour, and slow-seared for a smoky Dhaba crust.",
    popular: true,
    spicyLevel: 2,
    tag: "Chef's Special"
  },
  {
    id: "item-3",
    name: "Slow-Roasted Mutton Sukka / Fry",
    category: "non-veg",
    isVeg: false,
    price: 360,
    description: "Tender bone-in mutton cooked in a rustic cast-iron skillet with caramelized onions, garlic, and freshly pounded garam masala.",
    popular: true,
    spicyLevel: 3,
    tag: "House Special"
  },
  {
    id: "item-4",
    name: "Veg Kasturi Paneer Tikka",
    category: "veg",
    isVeg: true,
    price: 210,
    description: "Fresh cottage cheese cubes marinated in fragrant fenugreek leaves, hung curd, and roasted highway spices.",
    popular: true,
    spicyLevel: 1,
    tag: "Vegetarian Pick"
  },
  {
    id: "item-5",
    name: "Dhaba Style Chilli Chicken",
    category: "starters",
    isVeg: false,
    price: 230,
    description: "Crispy battered chicken tossed with green chillies, spring onions, curry leaves, and a tangy dark soy glaze.",
    popular: false,
    spicyLevel: 2
  },
  {
    id: "item-6",
    name: "Crispy Andhra Gobi 65",
    category: "veg",
    isVeg: true,
    price: 180,
    description: "Crunchy cauliflower florets tossed with South Indian spices, fried curry leaves, and spicy green chillies.",
    popular: false,
    spicyLevel: 2
  },
  {
    id: "item-7",
    name: "Dum Handi Chicken Biryani",
    category: "biryani",
    isVeg: false,
    price: 250,
    description: "Fragrant long-grain aged basmati rice slow-cooked with spiced marinated chicken, saffron milk, and fried onions.",
    popular: true,
    spicyLevel: 2,
    tag: "Crowd Favorite"
  },
  {
    id: "item-8",
    name: "Ghee Jeera Rice & Dal Tadka",
    category: "biryani",
    isVeg: true,
    price: 190,
    description: "Aromatic basmati rice tossed in pure desi ghee and cumin seeds, served with homestyle yellow dal tempered with garlic and hing.",
    popular: false,
    spicyLevel: 1
  },
  {
    id: "item-9",
    name: "Egg Chilli Fry",
    category: "snacks",
    isVeg: false,
    price: 150,
    description: "Hard-boiled eggs tossed with crushed red chillies, shallots, curry leaves, and cracked black pepper.",
    popular: false,
    spicyLevel: 2
  },
  {
    id: "item-10",
    name: "Masala Peanut Chaat",
    category: "snacks",
    isVeg: true,
    price: 110,
    description: "Crisp roasted peanuts tossed with finely diced onions, ripe tomatoes, fresh coriander, green chillies, and chaat masala.",
    popular: false,
    spicyLevel: 1
  },
  {
    id: "item-11",
    name: "Chilled Fresh Lime Soda",
    category: "beverages",
    isVeg: true,
    price: 60,
    description: "Freshly squeezed lemon juice, sparkling soda or chilled water, sweet or salted as per your preference.",
    popular: true,
    spicyLevel: 1
  },
  {
    id: "item-12",
    name: "Bar Beverages & Refreshments",
    category: "beverages",
    isVeg: true,
    price: 180,
    isPricePlaceholder: true,
    description: "Chilled draught & bottled beers, spirits, and bar beverages served in accordance with Karnataka state licensing guidelines (21+).",
    popular: true,
    tag: "Bar Service"
  },
  {
    id: "item-13",
    name: "Warm Gulab Jamun with Ice Cream",
    category: "desserts",
    isVeg: true,
    price: 90,
    description: "Traditional soft khoya dumplings soaked in saffron-cardamom sugar syrup, served with creamy vanilla ice cream.",
    popular: true,
    spicyLevel: 1
  }
];

export const initialReviews = [
  {
    id: "rev-1",
    author: "Ramesh Gowda",
    rating: 5,
    date: "Verified Google Review · 2 months ago",
    content: "Stopped here while traveling on NH 48 towards Bangalore. The Chicken Pepper Fry and Kasturi Kabab were outstanding. Good dhaba style taste with quick seating.",
    verified: true
  },
  {
    id: "rev-2",
    author: "Kiran Kumar M",
    rating: 4,
    date: "Verified Google Review · 3 months ago",
    content: "Good bar and restaurant near Bharamasagara. Reasonable prices, cold beer, and tasty non-veg side dishes like mutton fry. Staff is cordial.",
    verified: true
  },
  {
    id: "rev-3",
    author: "Prashanth N",
    rating: 4,
    date: "Verified Google Review · 5 months ago",
    content: "Spacious seating and good parking for vehicles right off the highway. Tasty food and relaxing evening spot with friends.",
    verified: true
  }
];

export const galleryItems = [
  {
    id: "gal-1",
    title: "Dining Hall & Lounge",
    category: "Interior",
    image: "/src/assets/images/hero_restaurant_dining_1790318044335.jpg",
    description: "Comfortable seating arrangement with ambient warm illumination."
  },
  {
    id: "gal-2",
    title: "Signature Chicken Pepper Fry",
    category: "Food",
    image: "/src/assets/images/dish_chicken_pepper_fry_1790318074413.jpg",
    description: "Freshly tossed with curry leaves, black pepper, and highway spices."
  },
  {
    id: "gal-3",
    title: "Bar Service & Chilled Drinks",
    category: "Drinks",
    image: "/src/assets/images/bar_cocktails_drinks_1790318096646.jpg",
    description: "Curated selection of refreshing beverages and cocktails."
  },
  {
    id: "gal-4",
    title: "Relaxed Dining Room",
    category: "Atmosphere",
    image: "/src/assets/images/about_hospitality_interior_1790318061709.jpg",
    description: "Unwind with family, travelers, and friends."
  },
  {
    id: "gal-5",
    title: "Group Gathering & Celebrations",
    category: "Dining",
    image: "/src/assets/images/special_group_dining_1790318108624.jpg",
    description: "Spacious table setups for celebratory dinners and team meetups."
  }
];

export const sampleReservations: Reservation[] = [
  {
    id: "THR-928103",
    customerName: "Sanjay Patil",
    mobile: "+91 98450 12345",
    email: "sanjay.p@example.com",
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: "20:00",
    guests: 4,
    seatingPreference: "Indoor",
    specialRequests: "Table near corner if available",
    createdAt: new Date().toISOString(),
    status: "confirmed"
  }
];
