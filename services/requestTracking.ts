import { ref, push, set } from 'firebase/database';
import { database } from '../firebase';

/**
 * Add expert request tracking to a field
 */
export const addExpertRequestToField = async (
    farmerId: string,
    fieldId: string,
    requestData: {
        expertId: string;
        expertName: string;
        status: string;
        requestedAt: string;
    }
): Promise<void> => {
    try {
        const requestsRef = ref(database, `Farmers/${farmerId}/Fields/${fieldId}/ExpertRequests`);
        const newRequestRef = push(requestsRef);

        await set(newRequestRef, requestData);
    } catch (error) {
        console.error('Error adding expert request to field:', error);
        throw new Error('Failed to add expert request tracking');
    }
};
