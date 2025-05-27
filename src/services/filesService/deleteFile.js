import api from '@/lib/api';

/**
 * File delete service
 */
const deleteFile = async (fileUrl) => {
    const data = { fileUrl }
    try {
        await api.delete(`/upload`, { data });
    } catch (error) {
        console.error('Error deleting files:', error);
        throw error;
    }
}

export default deleteFile;