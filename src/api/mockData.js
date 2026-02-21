
export const mockUsers = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'ADMIN', password: 'Admin@123' },
    { id: 2, name: 'Normal User', email: 'user@example.com', role: 'USER', password: 'password' },
    { id: 3, name: 'Editor User', email: 'editor@example.com', role: 'EDITOR', password: 'password' }
];

export const mockHomestays = [
    {
        id: 1,
        name: 'Cozy Cottage',
        description: 'A beautiful cottage in the countryside.',
        location: 'Countryside, UK',
        pricePerNight: 120,
        amenities: ['WiFi', 'Kitchen', 'Parking'],
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
    },
    {
        id: 2,
        name: 'City Apartment',
        description: 'Modern apartment in the heart of the city.',
        location: 'New York, USA',
        pricePerNight: 200,
        amenities: ['WiFi', 'Gym', 'Pool'],
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
    },
    {
        id: 3,
        name: 'Beach Villa',
        description: 'Relaxing villa with ocean view.',
        location: 'Malibu, USA',
        pricePerNight: 350,
        amenities: ['WiFi', 'Beach Access', 'Pool'],
        images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
    }
];

export const mockBookings = [
    {
        id: 1,
        homestayId: 1,
        userId: 2,
        checkIn: '2023-10-01',
        checkOut: '2023-10-05',
        status: 'CONFIRMED',
        totalPrice: 480
    },
    {
        id: 2,
        homestayId: 2,
        userId: 2,
        checkIn: '2023-11-15',
        checkOut: '2023-11-20',
        status: 'PENDING',
        totalPrice: 1000
    }
];

export const mockStats = {
    userCount: 150,
    homestayCount: 45,
    bookingCount: 320,
    chatCount: 12,
    revenue: 54000
};

export const mockChats = [
    { id: 1, username: 'tourist1', content: 'Is this place available next month?', timestamp: new Date().toISOString() },
    { id: 2, username: 'host2', content: 'Yes, it is available.', timestamp: new Date().toISOString() }
];


export const mockHomepage = {
    heroEyebrow: 'Your Journey Begins Here',
    heroTitle: 'Discover the heart of every destination.',
    heroSubtitle: 'Stay with locals, eat like a local, and experience the culture firsthand.',
    heroCtaPrimary: 'Explore Now',
    heroCtaSecondary: 'Learn More',
    stat1Label: 'Verified Stays',
    stat2Label: 'Cities Covered',
    stat3Label: 'Happy Travelers',
    homestayCount: 150,
    cityCount: 25,
    bookingCount: 1200,
    flowVisible: true,
    flowTitle: 'How it Works',
    flowSubtitle: 'Booking your dream homestay is easy.',
    step1Visible: true,
    step1Title: 'Search',
    step1Description: 'Find the perfect place by city or experience.',
    step2Visible: true,
    step2Title: 'Book',
    step2Description: 'Secure your stay with our easy booking system.',
    step3Visible: true,
    step3Title: 'Enjoy',
    step3Description: 'Immerse yourself in the local culture.',
    containers: [
        { id: 1, title: 'Featured Destinations', description: 'Top picks for you', visible: true, metricValue: 10, metricKey: 'destinations' },
        { id: 2, title: 'Limited Offers', description: 'Book now and save', visible: true, metricValue: 5, metricKey: 'offers' }
    ]
};

export const mockHomepageContainers = [
    { id: 1, title: 'Featured Destinations', description: 'Top picks for you', visible: true, sortOrder: 1 },
    { id: 2, title: 'Limited Offers', description: 'Book now and save', visible: true, sortOrder: 2 }
];

export const mockAbout = [
    { id: 1, name: 'John Doe', role: 'CEO', bio: 'Founder', visible: true, sortOrder: 1 }
];

