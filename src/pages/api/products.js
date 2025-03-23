import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({ _id: req.query.id }));
        }
        res.json(await Product.find());
    }

    if (method === 'POST') {
        const { title, description, price, images } = req.body;
        const productDocument = await Product.create({ 
            title, 
            description, 
            price: parseInt(price, 10),
            images
        });

        res.json(productDocument);
    }

    if (method === 'PUT') {
        const { title, description, price, images, _id } = req.body;
        const productDocument = await Product.updateOne({ _id }, { 
            title, 
            description, 
            price: parseInt(price, 10),
            images
        });

        res.json(productDocument);
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            const productDocument = await Product.deleteOne({ _id: req.query.id });
            res.json(productDocument);
        }
        
    }
}