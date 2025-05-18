import multiparty from 'multiparty';
import { PutObjectCommand, S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';

export default async function handler(req, res) {
    const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY
        }
    });

    if (req.method === 'POST') {
        const form = new multiparty.Form();
        const { files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        const links = [];

        for (const file of files.file) {
            const ext = file.originalFilename.split('.').pop();
            const newFileName = `${Date.now()}${file.originalFilename}.${ext}`;
            await s3Client.send(new PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: newFileName,
                Body: fs.createReadStream(file.path),
                ACL: 'public-read',
                ContentType: mime.lookup(file.path),
            }));
            links.push(`https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${newFileName}`);
        }

        return res.json({ links });
    } else if (req.method === 'DELETE') {
        const { link } = req.query;

        if (!link) {
            return res.status(400).json({ message: 'Missing image link to delete' });
        }

        try {
            // Extract the object key from the image URL
            const parts = link.split('/');
            const key = parts[parts.length - 1];

            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: key,
            }));

            return res.status(200).json({ message: 'Image deleted successfully' });
        } catch (error) {
            console.error('Error deleting image from S3:', error);
            return res.status(500).json({ message: 'Failed to delete image from S3' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}

export const config = {
    api: {
        bodyParser: false,
    },
};