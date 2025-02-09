# lighthouseBnB
LighthouseBnB
LighthouseBnB is a simple property rental app that allows users to browse, filter, and book properties. Users can also manage their reservations and add new property listings. This app is built using Node.js, Express, and PostgreSQL.


# Features
User Authentication: Users can sign up, log in, and manage their accounts.
Property Listings: View a list of available properties with filtering options.
Search Filters: Filter properties by city, price range, and ratings.
Reservations: Book properties and view/manage reservations.
Property Management: Add new property listings as an owner.

Tech Stack
Backend: Node.js, Express.js
Database: PostgreSQL

Frontend: HTML, CSS, JavaScript (EJS templates)

Other Tools: bcrypt for password hashing, pg for PostgreSQL connection, and Express-session for user session management.
Installation

Clone the repository:

bash
Copy
Edit
git clone https://github.com/yourusername/lighthousebnb.git
cd lighthousebnb
Install dependencies:

bash
Copy
Edit
npm install
Create a .env file in the root directory and configure the following:

env
Copy
Edit
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_NAME=lightbnb
DB_PORT=5432
Setup the database:

Run the schema file:
bash
Copy
Edit
psql -U your_database_user -d lightbnb -f migrations/01_schema.sql
Run the seed files:
bash
Copy
Edit
psql -U your_database_user -d lightbnb -f seeds/01_seeds.sql
psql -U your_database_user -d lightbnb -f seeds/02_seeds.sql
Start the server:

bash
Copy
Edit
npm run local
Open your browser and navigate to:

arduino
Copy
Edit
http://localhost:3000
Usage

# Homepage: View and filter properties.
Login: Log in with a registered email and password.
Sign Up: Create a new user account.
My Reservations: View all reservations made by the user.
Create Listing: Add a new property to the listings.
Database Schema
The database includes the following tables:

Users: Stores user information (e.g., name, email, password).
Properties: Stores property details (e.g., title, description, cost per night).
Reservations: Tracks user reservations for properties.
Property Reviews: Stores user reviews and ratings for properties.
For a detailed schema, refer to the migrations/01_schema.sql file.

# API Endpoints
Here are some key endpoints in the application:

Users
POST /login: Log in a user.
POST /register: Register a new user.
Properties
GET /properties: Retrieve all properties (with optional filters).
POST /properties: Add a new property.
Reservations
GET /reservations: Retrieve reservations for the logged-in user.



