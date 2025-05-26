import api from '@/lib/api';

/**
 * File delete service
 */
const deleteFile = async (id, fileUrl) => {
    try {
        await api.delete(`/upload/${id}`, { fileUrl });
    } catch (error) {
        console.error('Error deleting files:', error);
        throw error;
    }
}

export default deleteFile;