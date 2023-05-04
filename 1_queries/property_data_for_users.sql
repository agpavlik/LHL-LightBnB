-- # When the users come to our home page, they are going to see 
-- a list of properties. They will be able to view the properties 
-- and filter them by location. They will be able to see all data 
-- about the property, including the average rating.

SELECT properties.id, properties.title, properties.cost_per_night,
avg(property_reviews.rating) as average_rating
FROM properties
JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE city LIKE '%ancouv%'
GROUP BY properties.id
HAVING avg(property_reviews.rating) >= 4
ORDER BY properties.cost_per_night
LIMIT 10;