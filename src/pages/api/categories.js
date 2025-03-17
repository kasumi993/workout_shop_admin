export default function handler(req, res) {
    const { method } = req;
    if (method === 'GET') {
        return res.json({message: 'Hello World!'});
    }
    if (method === 'POST') {
        return res.json({message: 'Hello World!'});
    }
}