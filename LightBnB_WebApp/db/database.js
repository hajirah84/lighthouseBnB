const { Pool } = require('pg');

const pool = new Pool({
  user: 'hajirahmian', 
  password: '', 
  host: 'localhost',
  database: 'lightbnb'
});


const properties = require("./json/properties.json");
const users = require("./json/users.json");

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  return pool
    .query(
      `SELECT * FROM users WHERE email = $1;`, 
      [email]
    )
    .then((result) => {
      return result.rows[0] || null; // Return the user object or null if not found
    })
    .catch((err) => {
      console.error("Error fetching user with email:", err.message);
      return null;
    });
};



/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool
    .query(
      `SELECT * FROM users WHERE id = $1;`, 
      [id]
    )
    .then((result) => {
      return result.rows[0] || null; // Return the user object or null if not found
    })
    .catch((err) => {
      console.error("Error fetching user with ID:", err.message);
      return null;
    });
};



/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = (user) => {
  const { name, email, password } = user; // Destructure the user object
  return pool
    .query(
      `INSERT INTO users (name, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING *;`, 
      [name, email, password]
    )
    .then((result) => {
      return result.rows[0]; // Return the new user object
    })
    .catch((err) => {
      console.error("Error adding new user:", err.message);
      return null;
    });
};


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (guest_id, limit = 10) => {
  return pool
    .query(
      `
      SELECT reservations.*, properties.*, AVG(property_reviews.rating) as average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      LEFT JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY reservations.id, properties.id
      ORDER BY reservations.start_date
      LIMIT $2;
      `,
      [guest_id, limit]
    )
    .then((result) => {
      return result.rows; // Return the list of reservations
    })
    .catch((err) => {
      console.error("Error fetching reservations:", err.message);
      return [];
    });
};


/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  // 1. Array to hold query parameters
  const queryParams = [];

  // 2. Initial query string
  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) as average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_reviews.property_id
  `;

  // 3. Add filters based on options
  const whereClauses = [];

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    whereClauses.push(`city LIKE $${queryParams.length}`);
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    whereClauses.push(`owner_id = $${queryParams.length}`);
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100); // Convert dollars to cents
    whereClauses.push(`cost_per_night >= $${queryParams.length}`);
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100); // Convert dollars to cents
    whereClauses.push(`cost_per_night <= $${queryParams.length}`);
  }

  // Combine WHERE clauses if there are any
  if (whereClauses.length > 0) {
    queryString += `WHERE ${whereClauses.join(' AND ')} `;
  }

  // 4. Add HAVING clause for minimum_rating
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `GROUP BY properties.id HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  } else {
    queryString += `GROUP BY properties.id `;
  }

  // 5. Add ORDER BY and LIMIT
  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  // 6. Log query for debugging
  console.log(queryString, queryParams);

  // 7. Execute query and return results
  return pool.query(queryString, queryParams).then((res) => res.rows);
};




/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
