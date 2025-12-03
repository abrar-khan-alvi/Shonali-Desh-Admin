import { Farmer, Field } from '../types';

/**
 * Sends a consultation summary SMS to the farmer.
 * Aggregates data from all fields including AI and Expert consultations.
 * 
 * @param farmer The farmer object containing fields and consultations
 * @returns Promise<boolean> True if sent successfully
 */
export const sendConsultationSummarySMS = async (farmer: Farmer): Promise<boolean> => {
    if (!farmer.phone) {
        console.error('No phone number found for farmer:', farmer.name);
        return false;
    }

    let message = `Hello ${farmer.name},\nHere is your field summary:\n\n`;
    let hasContent = false;

    if (farmer.fields) {
        Object.values(farmer.fields).forEach((field: Field, index) => {
            const fieldName = `Field #${field.id ? field.id.slice(-6) : index + 1}`;
            let fieldSummary = `[${fieldName} - ${field.currentCrop?.name || 'Unknown Crop'}]\n`;
            let fieldHasInfo = false;

            // AI Consultations
            if (field.aiConsultations) {
                const latestAI = Object.values(field.aiConsultations).sort((a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                )[0];

                if (latestAI) {
                    fieldSummary += `AI: ${latestAI.problems.join(', ')}. Sol: ${latestAI.solutions.join(', ')}\n`;
                    fieldHasInfo = true;
                }
            }

            // Expert Consultations
            if (field.expertConsultations) {
                const latestExpert = Object.values(field.expertConsultations).sort((a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                )[0];

                if (latestExpert) {
                    fieldSummary += `Expert: ${latestExpert.advice}\n`;
                    fieldHasInfo = true;
                }
            }

            if (fieldHasInfo) {
                message += fieldSummary + '\n';
                hasContent = true;
            }
        });
    }

    if (!hasContent) {
        message += "No consultation data available yet.";
    }

    message += "Thank you for using Shonali Desh.";

    // Simulate API call
    console.log('--- SENDING SMS ---');
    console.log('To:', farmer.phone);
    console.log('Message:', message);
    console.log('-------------------');

    // Use the sms: protocol to open the default SMS app
    // This works on mobile devices and desktops with connected phones
    const encodedMessage = encodeURIComponent(message);
    const smsUrl = `sms:${farmer.phone}?body=${encodedMessage}`;

    // Create a temporary link and click it to avoid popup blockers
    const link = document.createElement('a');
    link.href = smsUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000);
    });
};
