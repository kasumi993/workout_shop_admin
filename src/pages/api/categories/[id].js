// pages/api/categories/[id].js
import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  const { id } = req.query; // Access the category ID from the URL
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === 'GET') {
    // Option 2: Get a specific category by ID (if you need this endpoint)
    const category = await Category.findById(id).populate('parent');
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } else if (method === 'PUT') {
    const { name, parentCategory, properties, _id } = req.body;
    if (_id !== id) {
      return res.status(400).json({ message: 'ID in body does not match URL ID' });
    }
    const categoryDoc = await Category.updateOne({ _id: id }, {
      name,
      parent: parentCategory || undefined,
      properties,
    });
    res.json(categoryDoc);
  } else if (method === 'DELETE') {
    await Category.deleteOne({ _id: id });
    res.json('ok');
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}