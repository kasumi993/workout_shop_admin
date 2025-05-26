import api from '@/lib/api';

/**
 * File upload service
 */
const uploadFile = async (files) => {

    const formData = new FormData();
    
    for (const file of files) {
        formData.append('file', file);
    }
    
    try {
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data || [];
    } catch (error) {
        console.error('Error uploading files:', error);
        throw error;
    }
}

export default uploadFile;