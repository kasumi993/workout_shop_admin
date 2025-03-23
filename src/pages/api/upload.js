import multiparty from 'multiparty';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';

export default async function handler(req, res) {

    const form = new multiparty.Form(); 
    const {files} = await new Promise((resolve,reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({fields, files});
        });
    });

    console.log("files");
    console.log(files);
    const client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY
        }
    });

    const links = [];

    for (const file of files.file) {
        const ext = file.originalFilename.split('.').pop();
        const newFileName = `${Date.now()}${file.originalFilename}.${ext}`;
        await client.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: newFileName,
            Body: fs.createReadStream(file.path),
            ACL: 'public-read',
            ContentType: mime.lookup(file.path),
        }));
        links.push(`https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${newFileName}`);
    }

    return res.json({links});
}

export const config = {
    api: {
        bodyParser: false,
    },
};