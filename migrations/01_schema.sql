-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create Properties Table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    thumbnail_photo_url VARCHAR(255),
    cover_photo_url VARCHAR(255),
    cost_per_night INTEGER NOT NULL,
    parking_spaces INTEGER DEFAULT 0,
    number_of_bathrooms INTEGER DEFAULT 0,
    number_of_bedrooms INTEGER DEFAULT 0,
    country VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    post_code VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

-- Create Reservations Table
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    guest_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Create Property Reviews Table
CREATE TABLE property_reviews (
    id SERIAL PRIMARY KEY,
    guest_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    reservation_id INTEGER NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    message TEXT NOT NULL
);