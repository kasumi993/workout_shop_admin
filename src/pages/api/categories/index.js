import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  
  try {
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
      try {
        const categories = await Category.find().populate('parent');
        res.status(200).json(categories);
      } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
      }
      
    } else if (method === 'POST') {
      const { name, parentCategory, properties } = req.body;
      
      // Input validation
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Name is required and must be a string' });
      }
      
      try {
        const categoryDoc = await Category.create({
          name,
          parent: parentCategory || undefined,
          properties,
        });
        res.status(201).json(categoryDoc);
      } catch (error) {
        console.error('POST Error:', error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
          const errors = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({ 
            error: 'Validation failed', 
            details: errors 
          });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
          return res.status(409).json({ 
            error: 'Category already exists', 
            details: `A category with name "${name}" already exists` 
          });
        }
        
        res.status(500).json({ 
          error: 'Failed to create category', 
          details: error.message 
        });
      }
      
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ 
        error: 'Method Not Allowed', 
        allowedMethods: ['GET', 'POST'] 
      });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error.message 
    });
  }
}