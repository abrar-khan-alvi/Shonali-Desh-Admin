import { ref, get, set, push, update } from 'firebase/database';
import { database } from '../firebase';
import { Farmer, Field, SubscriptionHistory } from '../types';

/**
 * Transform Firebase farmer data to match our TypeScript interface
 */
const transformFarmerData = (farmerId: string, data: any): Farmer => {
    // Convert nested objects to the expected format
    // Firebase uses capitalized field names: Fields, SubscriptionHistory
    const rawFields: { [key: string]: any } = data.Fields || data.fields || {};
    const subscriptionHistory: { [key: string]: SubscriptionHistory } =
        data.SubscriptionHistory || data.subscriptionHistory || {};

    // Transform each field to handle nested capitalized properties
    const fields: { [key: string]: Field } = {};
    Object.keys(rawFields).forEach(fieldId => {
        const fieldData = rawFields[fieldId];
        fields[fieldId] = {
            ...fieldData,
            id: fieldId,
            // Handle capitalized ExpertConsultations -> expertConsultations
            expertConsultations: fieldData.ExpertConsultations || fieldData.expertConsultations,
            // Handle capitalized AIConsultations -> aiConsultations
            aiConsultations: fieldData.AIConsultations || fieldData.aiConsultations,
            // Handle capitalized Alerts -> alerts
            alerts: fieldData.Alerts || fieldData.alerts,
            // Handle capitalized ExpertRequests -> expertRequests
            expertRequests: fieldData.ExpertRequests || fieldData.expertRequests,
            // Handle capitalized IoT with nested SensorReadings
            iot: fieldData.IoT || fieldData.iot ? {
                deviceInfo: (fieldData.IoT || fieldData.iot).deviceInfo,
                sensorReadings: (fieldData.IoT || fieldData.iot).SensorReadings || (fieldData.IoT || fieldData.iot).sensorReadings
            } : undefined,
        };
    });

    return {
        id: farmerId,
        name: data.name || '',
        phone: data.phone || '',
        photoUrl: data.photoUrl,
        nidUrl: data.nidUrl,
        region: data.region || '',
        district: data.district || '',
        upazila: data.upazila || '',
        village: data.village || '',
        hasSubscription: data.hasSubscription || false,
        subscriptionType: data.subscriptionType,
        subscriptionValidTill: data.subscriptionValidTill,
        termsAccepted: data.termsAccepted || false,
        verificationStatus: data.verificationStatus || 'pending',
        subscriptionHistory,
        fields,
    };
};

/**
 * Fetch all farmers from Firebase
 */
export const fetchAllFarmers = async (): Promise<Farmer[]> => {
    try {
        const farmersRef = ref(database, 'Farmers');
        const snapshot = await get(farmersRef);

        if (snapshot.exists()) {
            const farmersData = snapshot.val();
            const farmers: Farmer[] = [];

            Object.keys(farmersData).forEach((farmerId) => {
                const farmer = transformFarmerData(farmerId, farmersData[farmerId]);
                farmers.push(farmer);
            });

            return farmers;
        }

        return [];
    } catch (error) {
        console.error('Error fetching farmers:', error);
        throw new Error('Failed to fetch farmers from Firebase');
    }
};

/**
 * Fetch a single farmer by ID
 */
export const fetchFarmerById = async (farmerId: string): Promise<Farmer | null> => {
    try {
        const farmerRef = ref(database, `Farmers/${farmerId}`);
        const snapshot = await get(farmerRef);

        if (snapshot.exists()) {
            return transformFarmerData(farmerId, snapshot.val());
        }

        return null;
    } catch (error) {
        console.error(`Error fetching farmer ${farmerId}:`, error);
        throw new Error('Failed to fetch farmer from Firebase');
    }
};

/**
 * Add a new farmer to Firebase
 */
export const addFarmer = async (farmerData: Partial<Farmer>): Promise<string> => {
    try {
        const farmersRef = ref(database, 'Farmers');
        const newFarmerRef = push(farmersRef);
        const farmerId = newFarmerRef.key;

        if (!farmerId) {
            throw new Error('Failed to generate farmer ID');
        }

        // Prepare data for Firebase (remove id as it's the key)
        const { id, fields, subscriptionHistory, ...dataToSave } = farmerData as any;

        await set(newFarmerRef, {
            ...dataToSave,
            verificationStatus: dataToSave.verificationStatus || 'pending',
            termsAccepted: dataToSave.termsAccepted || false,
            hasSubscription: dataToSave.hasSubscription || false,
        });

        return farmerId;
    } catch (error) {
        console.error('Error adding farmer:', error);
        throw new Error('Failed to add farmer to Firebase');
    }
};

/**
 * Update an existing farmer
 */
export const updateFarmer = async (
    farmerId: string,
    updates: Partial<Farmer>
): Promise<void> => {
    try {
        const farmerRef = ref(database, `Farmers/${farmerId}`);
        const { id, fields, subscriptionHistory, ...dataToUpdate } = updates as any;

        await update(farmerRef, dataToUpdate);
    } catch (error) {
        console.error(`Error updating farmer ${farmerId}:`, error);
        throw new Error('Failed to update farmer in Firebase');
    }
};

/**
 * Add a field to a farmer
 */
export const addFieldToFarmer = async (
    farmerId: string,
    fieldData: Partial<Field>
): Promise<string> => {
    try {
        const fieldsRef = ref(database, `Farmers/${farmerId}/Fields`);
        const newFieldRef = push(fieldsRef);
        const fieldId = newFieldRef.key;

        if (!fieldId) {
            throw new Error('Failed to generate field ID');
        }

        const { id, ...dataToSave } = fieldData as any;

        await set(newFieldRef, dataToSave);

        return fieldId;
    } catch (error) {
        console.error(`Error adding field to farmer ${farmerId}:`, error);
        throw new Error('Failed to add field to Firebase');
    }
};
