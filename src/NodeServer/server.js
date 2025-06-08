// ✅ You said your database.js exposes { sql, connectDB } so let's use only that
// Final working login route with pure Node.js
const socketIo = require('socket.io');
const http = require('http');
const { parse,URL } = require('url');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql, connectDB } = require('./Database/database'); // Using your DB config file
const API_BASE = 'http://localhost:5000/api';
const cloudinary =require('cloudinary').v2
const stringSimilarity = require('string-similarity');
const geolib = require('geolib');

cloudinary.config({
  cloud_name: 'abdullahcloud', // Replace with your Cloudinary cloud name
  api_key: '259835984394572', // Replace with your Cloudinary API key
  api_secret: 'qiMO9VfDsUeosR4Njt8ulbg1FJY' // Replace with your Cloudinary API secret
});

const SECRET = 'your_jwt_secret'; // Change this in production
async function getLocationScore(loc1, loc2) {
  // Regex for Latitude: matches "Lat: " followed by a number
  const latRegex = /Lat:\s*([\d.-]+)/;

  // FIX HERE: Regex for Longitude to match EITHER 'Lon:' or 'Lng:'
  // (?:...) creates a non-capturing group. This ensures that the actual number
  // remains in the first captured group ([1]) of the match result.
  const lonRegex = /(?:L(?:on|ng)):\s*([\d.-]+)/; // Matches 'Lon:' or 'Lng:'

  // --- STEP 1: Basic validation for null/undefined/non-string inputs ---
  if (typeof loc1 !== 'string' || !loc1 || typeof loc2 !== 'string' || !loc2) {
      console.warn("getLocationScore: One or both location inputs are invalid (null, undefined, or not a string). Returning 0 score.", { loc1, loc2 });
      return 0;
  }

  // --- STEP 2: Extract and validate coordinates for loc1 ---
  const latMatch1 = loc1.match(latRegex);
  const lonMatch1 = loc1.match(lonRegex); // Use the flexible regex

  if (!latMatch1 || !lonMatch1 || latMatch1.length < 2 || lonMatch1.length < 2) {
      // Updated log message to reflect that both 'Lon' and 'Lng' are now accepted
      console.warn("getLocationScore: Malformed location string 1. Expected 'Lat: X, (Lon|Lng): Y' format. Got:", loc1);
      return 0;
  }

  const lat1 = parseFloat(latMatch1[1]);
  const lon1 = parseFloat(lonMatch1[1]); // Access the first captured group for the number

  if (isNaN(lat1) || isNaN(lon1)) {
      console.warn("getLocationScore: Failed to parse valid numbers from location string 1.", { lat1, lon1, original: loc1 });
      return 0;
  }

  // --- STEP 3: Extract and validate coordinates for loc2 ---
  const latMatch2 = loc2.match(latRegex);
  const lonMatch2 = loc2.match(lonRegex); // Use the flexible regex

  if (!latMatch2 || !lonMatch2 || latMatch2.length < 2 || lonMatch2.length < 2) {
      // Updated log message to reflect that both 'Lon' and 'Lng' are now accepted
      console.warn("getLocationScore: Malformed location string 2. Expected 'Lat: X, (Lon|Lng): Y' format. Got:", loc2);
      return 0;
  }

  const lat2 = parseFloat(latMatch2[1]);
  const lon2 = parseFloat(lonMatch2[1]); // Access the first captured group for the number

  if (isNaN(lat2) || isNaN(lon2)) {
      console.warn("getLocationScore: Failed to parse valid numbers from location string 2.", { lat2, lon2, original: loc2 });
      return 0;
  }

  // --- STEP 4: Calculate the geographical distance using geolib ---
  const distanceMeters = geolib.getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
  );

  // --- STEP 5: Calculate the score based on distance ---
  const maxDistanceThresholdMeters = 5000; // 5 kilometers
  return Math.max(0, 1 - distanceMeters / maxDistanceThresholdMeters);
}

async function getDateProximityScore(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffDays = Math.abs((d1 - d2) / (1000 * 60 * 60 * 24));
  const maxDays = 30; // max 30 days difference
  return Math.max(0, 1 - diffDays / maxDays);
}

async function calculateMatchScore(lostItem, foundItem) {
  const nameSimilarity = stringSimilarity.compareTwoStrings(
    lostItem.itemName.toLowerCase(),
    foundItem.itemName.toLowerCase()
  );

  const categoryMatch = lostItem.categoryID === foundItem.categoryId ? 1 : 0;

  const locationSimilarity = await getLocationScore(lostItem.location, foundItem.location);

  const dateProximityScore = await getDateProximityScore(lostItem.createdAt, foundItem.createdAt);

  const descriptionSimilarity = stringSimilarity.compareTwoStrings(
    lostItem.description.toLowerCase(),
    foundItem.description.toLowerCase()
  );

  const score =
    0.4 * nameSimilarity +
    0.2 * categoryMatch +
    0.15 * locationSimilarity +
    0.15 * dateProximityScore +
    0.1 * descriptionSimilarity;

  return score;
}


function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS,PUT',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}


const server = http.createServer(async (req, res) => {
  const url = parse(req.url, true);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS,PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  if (req.method === 'POST' && url.pathname === '/login') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const { email, password } = JSON.parse(body);
        if (!email || !password) {
          sendJSON(res, 400, { message: 'Email and password are required' });
          return;
        }

        await connectDB();
        const result = await sql.query`
          SELECT userid, hash_password FROM Users WHERE email = ${email}
        `;

        const user = result.recordset[0];
        if (!user) {
          sendJSON(res, 401, { message: 'User not found' });
          return;
        }

        const valid = await bcrypt.compare(password, user.hash_password);
        if (!valid) {
          sendJSON(res, 401, { message: 'Incorrect password' });
          return;
        }

        const token = jwt.sign({ userid: user.userid, email }, SECRET, { expiresIn: '1h' });
        sendJSON(res, 200, { uID: user.userid, token });
      } catch (err) {
        console.error(err);
        sendJSON(res, 500, { message: 'Server error' });
      }
    });
    return;
  }
else  if (req.method === 'POST' && url.pathname === '/signup') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const { firstName, lastName, email, password } = JSON.parse(body);
  
        if (!firstName || !lastName || !email || !password) {
          sendJSON(res, 400, { message: 'All fields are required' });
          return;
        }
  
        await connectDB(); // Ensure DB is connected
  
        const checkUser = await sql.query`SELECT * FROM Users WHERE email = ${email}`;
        if (checkUser.recordset.length > 0) {
          sendJSON(res, 409, { message: 'Email already exists' });
          return;
        }
  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        await sql.query`
          INSERT INTO Users (firstName, lastName, email, hash_password)
          VALUES (${firstName}, ${lastName}, ${email}, ${hashedPassword})
        `;
  
        sendJSON(res, 201, { message: 'Signup successful' });
      } catch (err) {
        console.error(err);
        sendJSON(res, 500, { message: 'Server error during signup' });
      }
    });
    return;
  }
  
 else if (req.method === 'POST' && url.pathname === '/report-lost-item') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const {
          itemName,
          description,
          location,
          contactInfo,
          itemCategory,
          acceptedTerms,
          imageUrl,
          uID,
        } = JSON.parse(body);
  
        // Validation check
        if (
          !itemName || !description || !location || !contactInfo ||
          !itemCategory || !acceptedTerms || !uID
        ) {
          sendJSON(res, 400, { message: 'All fields are required' });
          return;  // STOP after sending response
        }
  
        await connectDB();
        console.log(itemCategory);
        const categoryResult = await sql.query`
          SELECT categoryId FROM Categories WHERE categoryName = ${itemCategory}
        `;
  
        if (categoryResult.recordset.length === 0) {
          sendJSON(res, 400, { message: 'Invalid category' });
          return;  // STOP here too
        }
  
        const categoryID = categoryResult.recordset[0].categoryId;
  
        await sql.query`
          INSERT INTO LostItems (
            itemName, description, location, contactInfo, categoryID,
            image, userID, likesCount, noOfComments, createdAt
          ) VALUES (
            ${itemName}, ${description}, ${location}, ${contactInfo}, ${categoryID},
            ${imageUrl}, ${uID}, 0, 0, GETDATE()
          )
        `;
  
        sendJSON(res, 201, { message: 'Item reported successfully' });
        return; // always safe to put return after sending response
  
      } catch (err) {
        console.error(err);
        if (!res.writableEnded) {  // check if response is not yet sent
          sendJSON(res, 500, { message: 'Error reporting item' });
        }
        // no return needed here as this is the last block
      }
    });
  }
  else if (req.method === 'GET' && url.pathname === '/api/lost-items') {
    try {
      await connectDB();
  
      const search = url.query.search?.trim() || '';
      const range = url.query.range || '';
  
      let query = `
        SELECT 
          l.id,
          l.itemName,
          l.description,
          l.location,
          l.contactInfo,
          l.image,
          l.likesCount,
          l.noOfComments,
          l.createdAt,
          c.categoryName,
          u.firstName,
          u.lastName
        FROM LostItems l
        INNER JOIN Categories c ON l.categoryID = c.categoryId
        INNER JOIN Users u ON l.userID = u.userid
        WHERE itemFoundStatus=0 and status = 'approved'
      `;
  
      if (search) {
        query += ` AND (l.itemName LIKE '%' + @search + '%' OR l.description LIKE '%' + @search + '%')`;
      }
  
      if (range === '24h') {
        query += ` AND l.createdAt >= DATEADD(HOUR, -24, GETDATE())`;
      } else if (range === 'week') {
        query += ` AND l.createdAt >= DATEADD(DAY, -7, GETDATE())`;
      } else if (range === 'month') {
        query += ` AND l.createdAt >= DATEADD(MONTH, -1, GETDATE())`;
      }
  
      query += ' ORDER BY l.createdAt DESC';
  
      const request = new sql.Request();
      if (search) {
        request.input('search', sql.NVarChar, search);
      }
      const result = await request.query(query);
  
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify(result.recordset));
    } catch (err) {
      console.error('Lost items fetch error:', err);
      if (!res.writableEnded) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to fetch lost items' }));
      }
    }
    return;
  }

  else if (req.method === 'POST' && url.pathname === '/api/likes') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const { itemId, userId } = JSON.parse(body);
  
        if (!itemId || !userId) {
          sendJSON(res, 400, { message: 'Missing itemId or userId' });
          return;
        }
  
        await connectDB();
  
        // Check if like already exists
        const likeCheck = await sql.query`
          SELECT * FROM Likes WHERE lostItemId = ${itemId} AND userId = ${userId}
        `;
  
        if (likeCheck.recordset.length > 0) {
          sendJSON(res, 200, { message: 'Already liked' });
          return;
        }
  
        // Insert new like
        await sql.query`
          INSERT INTO Likes (lostItemId, userId) VALUES (${itemId}, ${userId})
        `;
  
        // Update likesCount in LostItems
        await sql.query`
          UPDATE LostItems SET likesCount = likesCount + 1 WHERE id = ${itemId}
        `;
  
        sendJSON(res, 200, { message: 'Like added successfully' });
      } catch (err) {
        console.error('Failed to add like:', err);
        sendJSON(res, 500, { message: 'Failed to add like' });
      }
    });
    return;
  }

  else if (req.method === 'POST' && url.pathname === '/api/comments') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const { itemId, userId, commentText } = JSON.parse(body);
  
        if (!itemId || !userId || !commentText) {
          sendJSON(res, 400, { message: 'Missing itemId, userId, or commentText' });
          return;
        }
  
        await connectDB();
  
        // Insert comment into Comments table
        await sql.query`
          INSERT INTO Comments (lostItemId, userId, commentText)
          VALUES (${itemId}, ${userId}, ${commentText})
        `;
  
        // Update noOfComments count in LostItems
        await sql.query`
          UPDATE LostItems SET noOfComments = noOfComments + 1 WHERE id = ${itemId}
        `;
  
        sendJSON(res, 201, { message: 'Comment added successfully' });
      } catch (err) {
        console.error('Failed to add comment:', err);
        sendJSON(res, 500, { message: 'Failed to add comment' });
      }
    });
    return;
  }
  else if (req.method === 'POST' && url.pathname === '/api/report-found-item') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const {
          itemName,
          description,
          location,
          contactInfo,
          itemCategory,
          imageUrl,
          userId,
        } = JSON.parse(body);
  
        // Validate required fields
        if (
          !itemName ||
          !description ||
          !location ||
          !contactInfo ||
          !itemCategory ||
          !userId
        ) {
          sendJSON(res, 400, { message: 'All fields are required' });
          return;
        }
  
        await connectDB();
  
        // Get category ID from category name
        const categoryResult = await sql.query`
          SELECT categoryId FROM Categories WHERE categoryName = ${itemCategory}
        `;
  
        if (categoryResult.recordset.length === 0) {
          sendJSON(res, 400, { message: 'Invalid category' });
          return;
        }
  
        const categoryID = categoryResult.recordset[0].categoryId;
  
        // Insert found item record
        await sql.query`
          INSERT INTO FoundItems (
            itemName, description, location, contactInfo, categoryID,
            image, userID, likesCount, noOfComments
          ) VALUES (
            ${itemName}, ${description}, ${location}, ${contactInfo}, ${categoryID},
            ${imageUrl || ''}, ${userId}, 0, 0
          )
        `;
  
        sendJSON(res, 201, { message: 'Found item reported successfully' });
      } catch (err) {
        console.error('Error reporting found item:', err);
        if (!res.writableEnded) {
          sendJSON(res, 500, { message: 'Error reporting found item' });
        }
      }
    });
    return;
  }
  else if (req.method === 'GET' && url.pathname === '/api/found-items') {
    try {
      await connectDB();
  
      const search = (url.query.search || '').trim();
      const range = url.query.range || '';
  
      let query = `
        SELECT
          f.id,
          f.itemName,
          f.description,
          f.location,
          f.contactInfo,
          f.image as image,
          f.likesCount,
          f.noOfComments,
          f.createdAt,
          c.categoryName,
          u.firstName,
          u.lastName
        FROM FoundItems f
        INNER JOIN Categories c ON f.categoryID = c.categoryId
        INNER JOIN Users u ON f.userID = u.userid
        WHERE  status = 'approved'
      `;
  
      if (search) {
        query += ` AND (f.itemName LIKE '%' + @search + '%' OR f.description LIKE '%' + @search + '%')`;
      }
  
      if (range === '24h') {
        query += ` AND f.createdAt >= DATEADD(HOUR, -24, GETDATE())`;
      } else if (range === 'week') {
        query += ` AND f.createdAt >= DATEADD(DAY, -7, GETDATE())`;
      } else if (range === 'month') {
        query += ` AND f.createdAt >= DATEADD(MONTH, -1, GETDATE())`;
      }
  
      query += ' ORDER BY f.createdAt DESC';
  
      const request = new sql.Request();
      if (search) {
        request.input('search', sql.NVarChar, search);
      }
      const result = await request.query(query);
  
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify(result.recordset));
    } catch (err) {
      console.error('Error fetching found items:', err);
      if (!res.writableEnded) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to fetch found items' }));
      }
    }
    return;
  }
  else if (req.method === 'POST' && url.pathname === '/api/found-likes') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const { foundItemId, userId } = JSON.parse(body);
  console.log("found item id ",foundItemId,"userID",userId);
        if (!foundItemId || !userId) {
          sendJSON(res, 400, { message: 'Missing foundItemId or userId' });
          return;
        }
  
        await connectDB();
  
        // Check if already liked
        const likeExists = await sql.query`
          SELECT * FROM FoundLikes WHERE foundItemId = ${foundItemId} AND userId = ${userId}
        `;
  
        if (likeExists.recordset.length > 0) {
          sendJSON(res, 200, { message: 'Already liked' });
          return;
        }
  
        // Insert like
        await sql.query`
          INSERT INTO FoundLikes (foundItemId, userId)
          VALUES (${foundItemId}, ${userId})
        `;
  
        // Update likesCount in FoundItems table
        await sql.query`
          UPDATE FoundItems SET likesCount = likesCount + 1 WHERE id = ${foundItemId}
        `;
  
        sendJSON(res, 200, { message: 'Like added successfully' });
  
      } catch (err) {
        console.error('Failed to like found item:', err);
        sendJSON(res, 500, { message: 'Failed to like found item' });
      }
    });
    return;
  }
  else if (req.method === 'POST' && url.pathname === '/api/found-comments') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const { foundItemId, userId, commentText } = JSON.parse(body);
  
        if (!foundItemId || !userId || !commentText) {
          sendJSON(res, 400, { message: 'Missing foundItemId, userId, or commentText' });
          return;
        }
  
        await connectDB();
  
        // Insert comment
        await sql.query`
          INSERT INTO FoundComments (foundItemId, userId, commentText)
          VALUES (${foundItemId}, ${userId}, ${commentText})
        `;
  
        // Update comment count in FoundItems
        await sql.query`
          UPDATE FoundItems SET noOfComments = noOfComments + 1 WHERE id = ${foundItemId}
        `;
  
        sendJSON(res, 201, { message: 'Comment added successfully' });
  
      } catch (err) {
        console.error('Failed to add comment on found item:', err);
        sendJSON(res, 500, { message: 'Failed to add comment on found item' });
      }
    });
    return;
  }
  else if (req.method === 'GET' && url.pathname === '/api/matches/best-match') {
    const lostItemId = parseInt(url.query.lostItemId, 10);
    if (isNaN(lostItemId)) {
      return sendJSON(res, 400, { error: 'Valid lostItemId is required' });
    }
  
    try {
      await connectDB();
  
      // Get lost item
      const lostItemResult = await sql.query`SELECT * FROM LostItems WHERE id = ${lostItemId}`;
      const lostItem = lostItemResult.recordset[0];
      if (!lostItem) {
        return sendJSON(res, 404, { error: 'Lost item not found' });
      }
  
      // Get all found items
      const foundItemsResult = await sql.query`SELECT * FROM FoundItems`;
      const foundItems = foundItemsResult.recordset;
  
      if (!foundItems || foundItems.length === 0) {
        return sendJSON(res, 404, { error: 'No found items available' });
      }
  
      // Match scoring
      const matchCalculations = await Promise.all(
        foundItems.map(async (foundItem) => {
          const score = await calculateMatchScore(lostItem, foundItem);
          return score > 0.3 ? { lostItemId, foundItem: foundItem, score } : null;
        })
      );
  
      const matches = matchCalculations.filter(Boolean);
  
      // Insert or update
      for (const match of matches) {
        const existingMatch = await sql.query`
          SELECT * FROM Matches WHERE lostItemId = ${match.lostItemId} AND foundItemId = ${match.foundItem.id}
        `;
        if (existingMatch.recordset.length > 0) {
          await sql.query`
            UPDATE Matches SET matchScore = ${match.score} WHERE lostItemId = ${match.lostItemId} AND foundItemId = ${match.foundItemId}
          `;
        } else {
          await sql.query`
            INSERT INTO Matches (lostItemId, foundItemId, matchScore) VALUES (${match.lostItemId}, ${match.foundItem.id}, ${match.score})
          `;
        }
      }
  
      // Return sorted matches
      matches.sort((a, b) => b.score - a.score);
      return sendJSON(res, 200, { matches });
  
    } catch (err) {
      console.error('Error computing best match:', err);
      return sendJSON(res, 500, { error: 'Internal server error' });
    }
  }else if (req.method === 'GET' && url.pathname === '/api/user/lost-items') {
    try {
      const userId = url.query.userId;
      if (!userId) {
        sendJSON(res, 400, { message: 'Missing userId query parameter' });
        return;
      }
  
      await connectDB();
  
      const query = `
        SELECT
          l.id,
          l.itemName,
          l.description,
          l.location,
          l.contactInfo,
          l.image,
          l.likesCount,
          l.noOfComments,
          l.createdAt,
          c.categoryName
        FROM LostItems l
        INNER JOIN Categories c ON l.categoryID = c.categoryId
        WHERE l.userID = @userId
        ORDER BY l.createdAt DESC
      `;
  
      const request = new sql.Request();
      request.input('userId', sql.Int, userId);
      const result = await request.query(query);
  
      sendJSON(res, 200, result.recordset);
    } catch (err) {
      console.error('Error fetching user lost items:', err);
      sendJSON(res, 500, { message: 'Failed to fetch lost items' });
    }
    return;
  }else if (req.method === 'GET' && url.pathname === '/api/user/found-items') {
    try {
      const userId = url.query.userId;
      if (!userId) {
        sendJSON(res, 400, { message: 'Missing userId query parameter' });
        return;
      }
  
      await connectDB();
  
      const query = `
        SELECT
          f.id,
          f.itemName,
          f.description,
          f.location,
          f.contactInfo,
          f.image,
          f.likesCount,
          f.noOfComments,
          f.createdAt,
          c.categoryName
        FROM FoundItems f
        INNER JOIN Categories c ON f.categoryID = c.categoryId
        WHERE f.userID = @userId
        ORDER BY f.createdAt DESC
      `;
  
      const request = new sql.Request();
      request.input('userId', sql.Int, userId);
      const result = await request.query(query);
  
      sendJSON(res, 200, result.recordset);
    } catch (err) {
      console.error('Error fetching user found items:', err);
      sendJSON(res, 500, { message: 'Failed to fetch found items' });
    }
    return;
  }
 
  else if (req.method === 'GET' && url.pathname === '/api/user/stats') {
    try {
      const userId = url.query.userId;
      if (!userId) {
        sendJSON(res, 400, { message: 'Missing userId query parameter' });
        return;
      }
  
      await connectDB();
      const request = new sql.Request();
      request.input('userId', sql.Int, userId);
         const user = await request.query(
          `SELECT * FROM Users WHERE userid =@userId`
         )
      // Total Lost and Found
      const totalLost = await request.query(`
        SELECT COUNT(*) AS totalLost FROM LostItems WHERE userID = @userId
      `);
      const totalFound = await request.query(`
        SELECT COUNT(*) AS totalFound FROM FoundItems WHERE userID = @userId
      `);
  
      // Lost Items by Category
      const lostByCategory = await request.query(`
        SELECT c.categoryName, COUNT(*) AS count
        FROM LostItems l
        JOIN Categories c ON l.categoryID = c.categoryId
        WHERE l.userID = @userId
        GROUP BY c.categoryName
      `);
  
      // Found Items by Category
      const foundByCategory = await request.query(`
        SELECT c.categoryName, COUNT(*) AS count
        FROM FoundItems f
        JOIN Categories c ON f.categoryID = c.categoryId
        WHERE f.userID = @userId
        GROUP BY c.categoryName
      `);
  
      // Lost Items per Month (last 6 months)
      const lostPerMonth = await request.query(`
        SELECT 
          DATENAME(MONTH, createdAt) + ' ' + CAST(YEAR(createdAt) AS VARCHAR) AS month,
          COUNT(*) AS count
        FROM LostItems
        WHERE userID = @userId AND createdAt >= DATEADD(MONTH, -5, GETDATE())
        GROUP BY YEAR(createdAt), MONTH(createdAt), DATENAME(MONTH, createdAt)
        ORDER BY YEAR(createdAt), MONTH(createdAt)
      `);
  
      // Found Items per Month (last 6 months)
      const foundPerMonth = await request.query(`
        SELECT 
          DATENAME(MONTH, createdAt) + ' ' + CAST(YEAR(createdAt) AS VARCHAR) AS month,
          COUNT(*) AS count
        FROM FoundItems
        WHERE userID = @userId AND createdAt >= DATEADD(MONTH, -5, GETDATE())
        GROUP BY YEAR(createdAt), MONTH(createdAt), DATENAME(MONTH, createdAt)
        ORDER BY YEAR(createdAt), MONTH(createdAt)
      `);
  
      // Convert category arrays to plain objects
      const lostCatMap = {};
      lostByCategory.recordset.forEach(row => {
        lostCatMap[row.categoryName] = row.count;
      });
  
      const foundCatMap = {};
      foundByCategory.recordset.forEach(row => {
        foundCatMap[row.categoryName] = row.count;
      });
  
      const lostMonthMap = {};
      lostPerMonth.recordset.forEach(row => {
        lostMonthMap[row.month] = row.count;
      });
  
      const foundMonthMap = {};
      foundPerMonth.recordset.forEach(row => {
        foundMonthMap[row.month] = row.count;
      });
  
      sendJSON(res, 200, {
        user:user.recordset[0],
        totalLost: totalLost.recordset[0].totalLost,
        totalFound: totalFound.recordset[0].totalFound,
        lostByCategory: lostCatMap,
        foundByCategory: foundCatMap,
        lostPerMonth: lostMonthMap,
        foundPerMonth: foundMonthMap
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      sendJSON(res, 500, { message: 'Failed to fetch dashboard statistics' });
    }
    return;
  }
  else if (req.method === 'POST' && url.pathname === '/claim-request') {
    try {
      const body = await parseJSONBody(req);
      const { foundItemId, claimantId, message } = body;
  
      if (!foundItemId || !claimantId || !message) {
        sendJSON(res, 400, { message: 'All fields are required' });
        return;
      }
  
      await connectDB(); // Reuses your DB connection logic
     const claim= await sql.query(`select * from ClaimRequests where foundItemId =${foundItemId} and 
      claimantId=${claimantId}
      `)
      if(claim.recordset.length > 0){
        sendJSON(res,408,{message:"you have already made the claim"})
        return;
      }
      await sql.query`
        INSERT INTO ClaimRequests (foundItemId, claimantId, message)
        VALUES (${foundItemId}, ${claimantId}, ${message})
      `;
  
      sendJSON(res, 201, { message: 'Claim request submitted successfully' });
    } catch (error) {
      console.error('Error inserting claim request:', error);
      sendJSON(res, 500, { message: 'Server error during claim request' });
    }
  }else if (req.method === 'POST' && url.pathname === '/send-notification') {
    try {
      const body = await parseJSONBody(req);
      const { foundItemId, senderId, message } = body;
  
      if (!foundItemId || !senderId || !message) {
        sendJSON(res, 400, { message: 'foundItemId, senderId, and message are required' });
        return;
      }
  
      await connectDB();
  
      // Find the finder (owner) of the found item
      const result = await sql.query`
        SELECT userID FROM FoundItems WHERE id = ${foundItemId}
      `;
  
      if (result.recordset.length === 0) {
        sendJSON(res, 404, { message: 'Found item not found' });
        return;
      }
  
      const finderId = result.recordset[0].userID;
  
      // Insert notification into Notifications table
      await sql.query`
        INSERT INTO Notifications (recipientId, senderId, message, isRead, createdAt)
        VALUES (${finderId}, ${senderId}, ${message}, 0, GETDATE())
      `;
  
      sendJSON(res, 201, { message: 'Notification sent to finder successfully' });
  
    } catch (err) {
      console.error('Error sending notification:', err);
      sendJSON(res, 500, { message: 'Server error while sending notification' });
    }
  }
// ... (Your existing imports, parseJSONBody, sendJSON, connectDB, and sql connection)

// ... (Your existing Node.js server code, including 'http', 'url', 'sql', 'cors' imports,
//      and your helper functions like connectDB, parseJSONBody, sendJSON)

// Inside your http.createServer callback, within the main routing logic:

    // ... (Your other else if blocks for /claim-request, /send-notification, etc.)

    // --- User Dashboard Route ---
   // ... (Your other else if blocks)

    // --- User Dashboard Route ---
    else if (req.method === 'GET' && url.pathname === '/user/dashboard') {
      try {
          const userId = parseInt(url.query.userId);

          if (isNaN(userId)) {
              sendJSON(res, 400, { message: 'User ID is required and must be a number.' });
              return;
          }

          await connectDB(); // Ensure connection pool is available

          // --- FIX: Create a NEW request object for each query ---

          // Fetch Lost Items posted by the user
           // New request object
          const myLostItemsResult = await sql.query`
              SELECT id, itemName, description, createdAt AS lostDate, location, contactInfo, createdAt
              FROM LostItems
              WHERE userID = ${userId}
              ORDER BY createdAt DESC;
          `;
          const myLostItems = myLostItemsResult.recordset;

          // Fetch Found Items posted by the user
         // New request object
          const myFoundItemsResult = await sql.query`
              SELECT id, itemName, description, createdAt AS foundDate, location, contactInfo, createdAt
              FROM FoundItems
              WHERE userID = ${userId}
              ORDER BY createdAt DESC;
          `;
          const myFoundItems = myFoundItemsResult.recordset;

          // Fetch Claim Requests made by the user
           // New request object
          const myClaimRequestsResult = await sql.query`
              SELECT
                  CR.claimId,
                  CR.foundItemId,
                  CR.message AS claimMessage,
                  CR.status AS claimStatus,
                  CR.createdAt AS claimCreatedAt,
                  FI.itemName AS foundItemName,
                  FI.description AS foundItemDescription,
                  FI.location AS foundItemLocation,
                  FI.createdAt AS foundItemDate,
                  U.userid AS finderId,
                  U.firstName AS finderFirstName,
                  U.lastName AS finderLastName
              FROM
                  ClaimRequests CR
              JOIN
                  FoundItems FI ON CR.foundItemId = FI.id
              JOIN
                  Users U ON FI.userID = U.userid -- Join to get finder's details
              WHERE
                  CR.claimantId = ${userId}
              ORDER BY
                  CR.createdAt DESC;
          `;
          const myClaimRequests = myClaimRequestsResult.recordset;

          // Send all collected data in a single JSON response
          sendJSON(res, 200, {
              myLostItems,
              myFoundItems,
              myClaimRequests
          });

      } catch (error) {
          console.error('Error fetching user dashboard data:', error);
          sendJSON(res, 500, { message: 'Server error while fetching dashboard data.' });
      }
  }
  // This block should be placed inside your `http.createServer(async (req, res) => { ... })` function in `server.js`.

// Make sure you have 'sql' and 'connectDB' imported at the top of your server.js:
// const { sql, connectDB } = require('./database'); // Adjust path if your file is named dbConfig.js or similar

// --- Admin All Posts Data Route ---
else if (req.method === 'GET' && url.pathname === '/api/admin/posts') {
  try {
      // HACKATHON ADMIN AUTH: Using your specified ADMIN_UID = 6.
      const ADMIN_UID = 7;
      const requestingUserId = parseInt(url.query.uID); // Use parsedUrl.query

      if (isNaN(requestingUserId) || requestingUserId !== ADMIN_UID) {
          sendJSON(res, 403, { message: 'Unauthorized: Admin access required.' });
          return;
      }

      // IMPORTANT: Ensure connectDB() provides a pool or connection.
      // If 'sql' itself is already connected globally, you might not need 'pool' explicitly here.
      // For robustness, let's assume 'connectDB()' gives a pool.
      const pool = await connectDB(); 

      // Fetch all Lost Items
      const requestLost = new sql.Request(pool);
      const lostItemsResult = await requestLost.query`
          SELECT
              id,
              itemName,
              description,
              location,
              contactInfo,
              userID AS uID,
              createdAt,
              image,
              status,
              'lost' AS type
          FROM LostItems
          ORDER BY createdAt DESC;
      `;
      const lostItems = lostItemsResult.recordset;

      // Fetch all Found Items
      const requestFound = new sql.Request(pool);
      const foundItemsResult = await requestFound.query`
          SELECT
              id,
              itemName,
              description,
              location,
              contactInfo,
              userID AS uID,
              createdAt,
              image,
              status,
              'found' AS type
          FROM FoundItems
          ORDER BY createdAt DESC;
      `;
      const foundItems = foundItemsResult.recordset;

      // --- NEW: Fetch all Claim Requests for Admin Dashboard ---
      const requestClaims = new sql.Request(pool); // Use the pool for consistency
      const claimRequestsResult = await requestClaims.query`
          SELECT
              CR.claimId,
              CR.foundItemId,
              CR.claimantId,
              CR.message AS claimMessage,
              CR.status AS claimStatus, -- Status of the claim (pending, approved, rejected)
              CR.createdAt AS claimCreatedAt,
              FI.itemName AS foundItemName,
              FI.description AS foundItemDescription,
              FI.location AS foundItemLocation,
              FI.contactInfo AS foundItemContact,
              U.firstName AS claimantFirstName,
              U.lastName AS claimantLastName,
              'claim' AS type -- Type for frontend distinction
          FROM
              ClaimRequests CR
          JOIN
              FoundItems FI ON CR.foundItemId = FI.id
          JOIN
              Users U ON CR.claimantId = U.userid
          ORDER BY CR.createdAt DESC;
      `;
      const claimRequests = claimRequestsResult.recordset;

      // --- MODIFIED: Combine all posts and claims ---
      const allPosts = [...lostItems, ...foundItems, ...claimRequests];

      // Client-side sort remains crucial to combine results from multiple queries into one sorted list
      allPosts.sort((a, b) => {
          // Dynamically pick the correct date field for sorting
          const dateA = a.createdAt || a.claimCreatedAt;
          const dateB = b.createdAt || b.claimCreatedAt;
          return new Date(dateB) - new Date(dateA);
      });

      sendJSON(res, 200, allPosts);

  } catch (error) {
      console.error('Error fetching all posts and claims for admin dashboard:', error);
      sendJSON(res, 500, { message: 'Server error while fetching admin posts and claims.' });
  }
}// This block should be placed inside your `http.createServer(async (req, res) => { ... })` function in `server.js`.
// Make sure you have 'sql' and 'connectDB' imported at the top of your server.js.

// --- APPROVE POST Route (CORRECTED: Dynamic Table Name Handling) ---
else if (req.method === 'POST' && url.pathname.startsWith('/api/admin/posts/') && url.pathname.endsWith('/approve')) {
  try {
      const ADMIN_UID = 7; // Your defined admin user ID
      const requestingUserId = parseInt(url.query.uID); // User ID from query parameter

      // Basic Admin authentication
      if (isNaN(requestingUserId) || requestingUserId !== ADMIN_UID) {
          sendJSON(res, 403, { message: 'Unauthorized: Admin access required.' });
          return;
      }

      const parts = url.pathname.split('/');
      const postId = parseInt(parts[4]); // Extract post ID from URL (e.g., /api/admin/posts/123/lost/approve)
      const itemType = parts[5]; // Extract item type ('lost' or 'found') - Assumes URL is /api/admin/posts/{postId}/{itemType}/approve

      // Validate extracted parameters
      if (isNaN(postId) || (itemType !== 'lost' && itemType !== 'found')) {
          sendJSON(res, 400, { message: 'Invalid post ID or item type in URL.' });
          return;
      }

      // Ensure the global SQL connection is established.
      await connectDB();

      const tableName = itemType === 'lost' ? 'LostItems' : 'FoundItems';

      // 1. Update the item status to 'approved'
      // *** CRITICAL FIX HERE: Dynamically construct the SQL string for the table name ***
      // You cannot parameterize table names directly with template literals.
      const updateQuery = `
          UPDATE ${tableName}
          SET status = 'approved'
          WHERE id = @postId;
      `;
      // Now, create a request and pass the parameter explicitly
      const request = new sql.Request(); // Use new sql.Request() without 'pool' if connectDB doesn't return it
      request.input('postId', sql.Int, postId); // Define the postId parameter

      const updateResult = await request.query(updateQuery); // Execute the query

      if (updateResult.rowsAffected[0] === 0) {
          // Item not found or already approved
          sendJSON(res, 404, { message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} item not found or already approved.` });
      } else {
          // 2. Fetch the original poster's userID and itemName for notification
          // Also need to construct this query string dynamically for the tableName
          const posterQuery = `SELECT userID, itemName FROM ${tableName} WHERE id = @postId;`;
          const posterRequest = new sql.Request();
          posterRequest.input('postId', sql.Int, postId);
          const posterResult = await posterRequest.query(posterQuery);

          const itemOwnerId = posterResult.recordset[0]?.userID;
          const itemName = posterResult.recordset[0]?.itemName || `Item ID ${postId}`; // Fallback name

          // 3. If item owner found, create and save notification to DB
          if (itemOwnerId) {
              const notificationMessage = `Your ${itemType} item "${itemName}" has been approved by an administrator!`;

              // Save notification to DB using sql.query - This can use template literal directly as no dynamic table name
              await sql.query`
                  INSERT INTO Notifications (recipientId, senderId, message, isRead, createdAt)
                  VALUES (${itemOwnerId}, ${ADMIN_UID}, ${notificationMessage}, 0, GETDATE());
              `;
              console.log(`Notification saved to DB for user ${itemOwnerId}: ${notificationMessage}`);
          }

          sendJSON(res, 200, { message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} item ${postId} approved successfully!` });
      }

  } catch (error) {
      console.error('Error approving post:', error);
      // Check if response has already been sent to avoid "Cannot set headers after they are sent"
      if (!res.headersSent) {
          sendJSON(res, 500, { message: 'Server error during post approval.' });
      }
  }
}
// PUT /api/items/:postId/:itemType/archive?uID={uID}
// POST /api/admin/posts/:postId/:itemType/archive?uID={uID}
// POST /api/admin/posts/:postId/:itemType/archive?uID={uID}
else if (req.method === 'POST' && url.pathname.startsWith('/api/admin/posts/') && url.pathname.endsWith('/archive')) {
  try {
      const parts = url.pathname.split('/');
      const postId = parseInt(parts[4]);
      const itemType = parts[5]; // 'lost' or 'found'

      const requestingUserId = parseInt(url.query.uID);

      if (isNaN(postId) || (itemType !== 'lost' && itemType !== 'found')) {
          return sendJSON(res, 400, { message: 'Invalid item ID or item type in URL.' });
      }
      if (isNaN(requestingUserId)) {
          return sendJSON(res, 400, { message: 'User ID (uID) is required and must be a number.' });
      }

      const ADMIN_UID = 7;
      if (requestingUserId !== ADMIN_UID) {
          return sendJSON(res, 403, { message: 'Access Denied: Not authorized to perform this action.' });
      }

      await connectDB(); // Ensure a database connection is active

      const tableName = itemType === 'lost' ? 'LostItems' : 'FoundItems';

      // --- Corrected: Use sql.Request for dynamic table names ---
      const checkRequest = new sql.Request();
      checkRequest.input('postId', sql.Int, postId); // Parameterize postId
      const checkResult = await checkRequest.query(`SELECT id, status FROM ${tableName} WHERE id = @postId;`); // tableName is injected directly

      if (checkResult.recordset.length === 0) {
          return sendJSON(res, 404, { message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} item not found.` });
      }

      if (checkResult.recordset[0].status.trim().toLowerCase() === 'archived') {
          return sendJSON(res, 200, { message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} item ${postId} is already archived.` });
      }

      // --- Corrected: Use sql.Request for dynamic table names in UPDATE ---
      const updateRequest = new sql.Request();
      updateRequest.input('postId', sql.Int, postId); // Parameterize postId
      const updateResult = await updateRequest.query(`
          UPDATE ${tableName}
          SET status = 'archived' 
          WHERE id = @postId;
      `);

      sendJSON(res, 200, { message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} item ${postId} archived successfully!` });

  } catch (error) {
      console.error('Error in admin archive route:', error);
      if (!res.headersSent) {
          sendJSON(res, 500, { message: 'Server error during item archiving.' });
      }
  }
}
   // --- Admin All Posts Data Route (with Debugging) ---
  
//   // ... (Your existing routes)

// --- GET Notifications for a User (Polling) ---
// Ensure 'sql' object and 'connectDB' function are available in this scope.
// e.g., const sql = require('mssql'); // or similar for your setup
// And your connectDB function should establish the connection pool for 'sql' to use.

// --- GET Notifications Route ---
else if (req.method === 'GET' && url.pathname === '/api/notifications') {
  try {
      const userId = parseInt(url.query.uID); // Get user ID from query parameter

      if (isNaN(userId)) {
          sendJSON(res, 400, { message: 'User ID is required and must be a number.' });
          return;
      }

      // Ensure the global SQL connection is established.
      // The sql.query method will implicitly use the connected pool.
      await connectDB();

      // Fetch notifications for the recipientId, ordered by createdAt (newest first)
      // Using sql.query directly with template literal parameters
      const result = await sql.query`
          SELECT
              N.id,
              N.message,
              N.isRead,
              N.createdAt,
              N.senderId,
              S.firstName AS senderFirstName,
              S.lastName AS senderLastName
          FROM Notifications AS N
          JOIN Users AS S ON N.senderId = S.userid
          WHERE N.recipientId = ${userId}
          ORDER BY N.createdAt DESC;
      `;

      sendJSON(res, 200, result.recordset);
  } catch (err) {
      console.error('Error fetching notifications:', err);
      sendJSON(res, 500, { message: 'Server error fetching notifications.' });
  }
}

// --- PUT Mark Notification as Read Route ---
else if (req.method === 'PUT' && url.pathname.startsWith('/api/notifications/')) {
  try {
      // Correctly extract ID from URL path (e.g., /api/notifications/123 -> parts[3] is '123')
      // Ensure you're using 'url.pathname' not just 'pathname'
      const parts = url.pathname.split('/');
      const notificationId = parseInt(parts[3]);
      const userId = parseInt(url.query.uID); // Get user ID from query parameter (for authorization)

      if (isNaN(notificationId) || isNaN(userId)) {
          sendJSON(res, 400, { message: 'Invalid notification ID or User ID.' });
          return;
      }

      // Ensure the global SQL connection is established.
      await connectDB();

      // Update the isRead status to 1 (true), ensuring the notification belongs to the specified user
      // Using sql.query directly with template literal parameters
      const updateResult = await sql.query`
          UPDATE Notifications
          SET isRead = 1
          WHERE id = ${notificationId} AND recipientId = ${userId};
      `;

      if (updateResult.rowsAffected[0] === 0) {
          // Notification not found for this user, or was already marked as read
          sendJSON(res, 404, { message: 'Notification not found or not authorized to update.' });
      } else {
          sendJSON(res, 200, { message: 'Notification marked as read successfully.' });
      }

  } catch (err) {
      console.error('Error marking notification as read:', err);
      // Check if response has already been sent to avoid "Cannot set headers after they are sent"
      if (!res.headersSent) {
          sendJSON(res, 500, { message: 'Server error marking notification as read.' });
      }
  }
}

// --- NEW: Handle Claim Action (Approve/Reject) ---
else if (req.method === 'POST' && url.pathname.startsWith('/api/admin/claims/')) {
  try {
      const parts = url.pathname.split('/');
      // Expected URL format: /api/admin/claims/{claimId}/{action}?uID=ADMIN_UID
      const claimId = parseInt(parts[4]); // Get claimId from /api/admin/claims/CLAIM_ID/action
      const action = parts[5]; // Get action (e.g., 'approve', 'reject')

      // HACKATHON ADMIN AUTH: Using your specified ADMIN_UID = 6.
      const ADMIN_UID = 7;
      const requestingUserId = parseInt(url.query.uID);

      if (isNaN(requestingUserId) || requestingUserId !== ADMIN_UID) {
          sendJSON(res, 403, { message: 'Unauthorized: Admin access required.' });
          return;
      }

      if (isNaN(claimId)) {
          sendJSON(res, 400, { message: 'Invalid Claim ID provided.' });
          return;
      }

      let newStatus;
      let notificationMessageToClaimant = '';
      let notificationMessageToFinder = '';

      if (action === 'approve') {
          newStatus = 'approved';
      } else if (action === 'reject') {
          newStatus = 'rejected';
      } else {
          sendJSON(res, 400, { message: 'Invalid action. Must be "approve" or "reject".' });
          return;
      }

      const pool = await connectDB();
      const request = new sql.Request(pool);

      // Start a transaction for atomicity (optional but good practice for multi-step operations)
      // await request.query('BEGIN TRANSACTION;'); // Uncomment if you want to use transactions

      // 1. Update the status of the claim request
      const updateResult = await request
          .input('claimId', sql.Int, claimId)
          .input('newStatus', sql.NVarChar, newStatus)
          .query`
              UPDATE ClaimRequests
              SET status = @newStatus
              WHERE claimId = @claimId AND status = 'pending'; -- Only update if currently pending
          `;

      if (updateResult.rowsAffected[0] === 0) {
          // await request.query('ROLLBACK;'); // Uncomment if using transactions
          // Claim not found, or it was not in 'pending' status (e.g., already approved/rejected)
          sendJSON(res, 404, { message: `Claim ID ${claimId} not found or is no longer pending.` });
          return;
      }

      // 2. Fetch relevant details for notification
      const claimDetailsResult = await request
          .input('claimIdDetail', sql.Int, claimId)
          .query`
              SELECT
                  cr.claimantId,
                  cr.foundItemId,
                  fi.userID AS finderId, -- CORRECTED: Using userID from FoundItems table
                  fi.itemName AS foundItemName
              FROM ClaimRequests cr
              JOIN FoundItems fi ON cr.foundItemId = fi.id
              WHERE cr.claimId = @claimIdDetail;
          `;

      if (claimDetailsResult.recordset.length === 0) {
          // This should ideally not happen if the update was successful, but good to check
          // await request.query('ROLLBACK;'); // Uncomment if using transactions
          sendJSON(res, 404, { message: 'Could not retrieve claim details for notification.' });
          return;
      }

      const claimDetails = claimDetailsResult.recordset[0];
      const { claimantId, foundItemId, finderId, foundItemName } = claimDetails;

      // 3. Construct and insert notifications based on action
      if (action === 'approve') {
          notificationMessageToClaimant = `Your claim for '${foundItemName}' (Item ID: ${foundItemId}) has been APPROVED! Please contact the item finder (User ID: ${finderId}) to arrange pickup.`;
          notificationMessageToFinder = `A claim for your found item '${foundItemName}' (Item ID: ${foundItemId}) has been APPROVED by the admin. The claimant's User ID is ${claimantId}. Please arrange the return of the item.`;

          // Notify Claimant
          await request
              .input('recipientIdClaimant', sql.Int, claimantId)
              .input('senderIdAdmin', sql.Int, ADMIN_UID)
              .input('messageClaimant', sql.NVarChar, notificationMessageToClaimant)
              .query`
                  INSERT INTO Notifications (recipientId, senderId, message)
                  VALUES (@recipientIdClaimant, @senderIdAdmin, @messageClaimant);
              `;

          // Notify Finder
          await request
              .input('recipientIdFinder', sql.Int, finderId)
              .input('senderIdAdmin2', sql.Int, ADMIN_UID)
              .input('messageFinder', sql.NVarChar, notificationMessageToFinder)
              .query`
                  INSERT INTO Notifications (recipientId, senderId, message)
                  VALUES (@recipientIdFinder, @senderIdAdmin2, @messageFinder);
              `;

      } else if (action === 'reject') { // action === 'reject'
          notificationMessageToClaimant = `Your claim for '${foundItemName}' (Item ID: ${foundItemId}) has been REJECTED. If you believe this is an error, please review the item details or contact support.`;
          notificationMessageToFinder = `A claim for your found item '${foundItemName}' (Item ID: ${foundItemId}) has been REJECTED by the admin. Your item is still listed as found.`;

          // Notify Claimant
          await request
              .input('recipientIdClaimantRejected', sql.Int, claimantId)
              .input('senderIdAdminRejected', sql.Int, ADMIN_UID)
              .input('messageClaimantRejected', sql.NVarChar, notificationMessageToClaimant)
              .query`
                  INSERT INTO Notifications (recipientId, senderId, message)
                  VALUES (@recipientIdClaimantRejected, @senderIdAdminRejected, @messageClaimantRejected);
              `;

          // Notify Finder (optional, but good for transparency)
          await request
              .input('recipientIdFinderRejected', sql.Int, finderId)
              .input('senderIdAdminRejected2', sql.Int, ADMIN_UID)
              .input('messageFinderRejected', sql.NVarChar, notificationMessageToFinder)
              .query`
                  INSERT INTO Notifications (recipientId, senderId, message)
                  VALUES (@recipientIdFinderRejected, @senderIdAdminRejected2, @messageFinderRejected);
              `;
      }

      // await request.query('COMMIT;'); // Uncomment if using transactions
      sendJSON(res, 200, { message: `Claim ID ${claimId} successfully marked as ${newStatus} and notifications sent.` });

  } catch (error) {
      // await request.query('ROLLBACK;'); // Uncomment if using transactions
      console.error(`Error processing claim action or sending notification:`, error);
      sendJSON(res, 500, { message: 'Server error processing claim action and notification.' });
  }
}

// --- NEW: Chat Message Sending Route ---
else if (req.method === 'POST' && url.pathname === '/api/chat/send') {
    try {
        const body = await parseJSONBody(req);
        const { senderId, receiverId, messageText, attachmentURL } = body;

        if (!senderId || !receiverId || !messageText) {
            sendJSON(res, 400, { message: 'Sender ID, Receiver ID, and message text are required.' });
            return;
        }

        await connectDB(); // Ensure DB connection

        await sql.query`
            INSERT INTO ChatMessages (senderId, receiverId, messageText, attachmentURL)
            VALUES (${senderId}, ${receiverId}, ${messageText}, ${attachmentURL || null});
        `;

        // Optionally, you might want to use socket.io here to instantly send the message to the receiver
        // For now, we'll just confirm successful storage to the sender.

        sendJSON(res, 201, { message: 'Message sent successfully.' });

    } catch (error) {
        console.error('Error sending chat message:', error);
        sendJSON(res, 500, { message: 'Server error sending message.' });
    }
}

// --- NEW: Chat Message Retrieval Route ---
else if (req.method === 'GET' && url.pathname === '/api/chat/messages') {
    try {
        const senderId = parseInt(url.query.senderId);
        const receiverId = parseInt(url.query.receiverId);

        if (isNaN(senderId) || isNaN(receiverId)) {
            sendJSON(res, 400, { message: 'Sender ID and Receiver ID are required and must be numbers.' });
            return;
        }

        await connectDB(); // Ensure DB connection

        // Fetch messages where sender is senderId and receiver is receiverId,
        // OR where sender is receiverId and receiver is senderId (to get full conversation)
        const result = await sql.query`
            SELECT
                messageId,
                senderId,
                receiverId,
                messageText,
                attachmentURL,
                isDelivered,
                isRead,
                sentAt
            FROM ChatMessages
            WHERE
                (senderId = ${senderId} AND receiverId = ${receiverId})
                OR
                (senderId = ${receiverId} AND receiverId = ${senderId})
            ORDER BY sentAt ASC;
        `;

        sendJSON(res, 200, result.recordset);

    } catch (error) {
        console.error('Error fetching chat messages:', error);
        sendJSON(res, 500, { message: 'Server error fetching messages.' });
    }
}

// --- NEW: Get All Conversations for a User ---
else if (req.method === 'GET' && url.pathname === '/api/chat/conversations') {
    try {
        const userId = parseInt(url.query.userId);

        if (isNaN(userId)) {
            sendJSON(res, 400, { message: 'User ID is required and must be a number.' });
            return;
        }

        await connectDB(); // Ensure DB connection

        // Get distinct users the current user has chatted with, and their names
        const result = await sql.query`
            SELECT DISTINCT
                CASE
                    WHEN senderId = ${userId} THEN receiverId
                    WHEN receiverId = ${userId} THEN senderId
                END AS otherUserId,
                U.firstName, -- Join to get first name of the other user
                U.lastName -- Join to get last name of the other user
            FROM ChatMessages CM
            JOIN Users U ON
                (CASE
                    WHEN CM.senderId = ${userId} THEN CM.receiverId
                    WHEN CM.receiverId = ${userId} THEN CM.senderId
                END) = U.userid
            WHERE CM.senderId = ${userId} OR CM.receiverId = ${userId};
        `;

        sendJSON(res, 200, result.recordset);

    } catch (error) {
        console.error('Error fetching chat conversations:', error);
        sendJSON(res, 500, { message: 'Server error fetching conversations.' });
    }
}

  else {
    
  }
});

server.listen(5000, () => console.log('Server running on http://localhost:5000'));