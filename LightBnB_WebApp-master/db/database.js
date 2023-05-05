const properties = require("./json/properties.json");
const users = require("./json/users.json");

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});



/// Users
//-----------------------------------------------------------------
/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = (email) => {
  return pool
    .query(
      `SELECT * FROM users WHERE email = $1`, [email.toLowerCase()])
    .then((result) => {
      console.log(result.rows[0])
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// ----------------------------------------------------------------
/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = (id) => {
  return pool
    .query(
      `SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      console.log(result.rows[0])
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// ----------------------------------------------------------------
/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = (user) => {
  return pool
  .query(`INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3) RETURNING *`, [user.name, user.email, user.password])
  .then((result) => {
    console.log(result.rows[0])
    return result.rows[0]
  }) 
  .catch((err) => {console.log(err.message)
  });
};


/// Reservations
// ------------------------------------------------------------------
/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (guest_id, limit = 10) => {
  return pool
    .query(
      `SELECT reservations.*, properties.title, properties.cost_per_night, reservations.start_date, avg(rating) as average_rating
        FROM reservations
        JOIN properties ON reservations.property_id = properties.id
        JOIN property_reviews ON properties.id = property_reviews.property_id
        WHERE reservations.guest_id = $1
        GROUP BY properties.id, reservations.id
        ORDER BY reservations.start_date
        LIMIT $2`, [guest_id, limit])
    .then((result) => {
      console.log(result.rows)
      return result.rows;
    })
    .catch((err) => {console.log(err.message)
  });
};



/// Properties
//-------------------------------------------------------------------
/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 10) => {
  return pool
    .query(
      `SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => { 
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

//-------------------------------------------------------------------




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
