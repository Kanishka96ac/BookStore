// Middleware for advanced querying, sorting, and pagination
const advancedQuery = (model) => async (req, res, next) => {
    let query;
  
    // Copy request query
    const reqQuery = { ...req.query };
  
    // Fields to exclude from the query
    const removeFields = ['sort', 'page', 'limit', 'fields'];
  
    // Remove fields from request query
    removeFields.forEach(param => delete reqQuery[param]);
  
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
  
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
    // Finding resource
    query = model.find(JSON.parse(queryStr));
  
    // Projection
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // Exclude __v field by default
    }
  
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
  
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
  
    query = query.skip(skip).limit(limit);
  
    // Execute query
    const results = await query;
  
    res.advancedResults = {
      success: true,
      count: results.length,
      data: results
    };
  
    next();
  };
  
  module.exports = advancedQuery;
  