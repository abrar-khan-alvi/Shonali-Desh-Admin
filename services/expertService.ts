import { ref, get, push, set } from 'firebase/database';
import { database } from '../firebase';
import { Expert, ConsultRequest } from '../types';

export const fetchAvailableExperts = async (): Promise<Expert[]> => {
    try {
        const expertsRef = ref(database, 'Experts');
        const snapshot = await get(expertsRef);

        if (snapshot.exists()) {
            const experts: Expert[] = [];
            snapshot.forEach((child) => {
                const expert = { id: child.key, ...child.val() } as Expert;
                // Filter for verified and available experts
                if (expert.verificationStatus === 'verified' && expert.hasAvailable) {
                    experts.push(expert);
                }
            });
            return experts;
        }
        return [];
    } catch (error) {
        console.error('Error fetching experts:', error);
        throw error;
    }
};

export const createConsultRequest = async (expertId: string, request: Omit<ConsultRequest, 'id'>): Promise<string> => {
    try {
        const requestsRef = ref(database, `Experts/${expertId}/consultRequests`);
        const newRequestRef = push(requestsRef);

        await set(newRequestRef, {
            ...request,
            createdAt: new Date().toISOString(),
            status: 'pending'
        });

        return newRequestRef.key as string;
    } catch (error) {
        console.error('Error creating consult request:', error);
        throw error;
    }
};
