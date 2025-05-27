import api from '@/lib/api';

/**
 * File upload service
 */
const uploadFile = (files) => new Promise ((res, rej) => {

    const formData = new FormData();
    
    for (const file of files) {
        formData.append('file', file);
    }

    api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((response) => {
            res(response.data || []);
        }
        )
        .catch((error) => {
            console.error('Error uploading files:', error);
            rej(error);
        });
});

export default uploadFile;