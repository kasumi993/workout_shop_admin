import api from '@/lib/api';

/**
 * File delete service
 */
const deleteFile = (fileUrl) => new Promise((res, rej) => {
    const data = { fileUrl }

    api.delete(`/upload`, { data })
    .then((response) => {
        res(response.data);

    })
    .catch((error) => {
        console.error('Error deleting file:', error);
        rej(error);
    });
})

export default deleteFile;