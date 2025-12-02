export enum UserStatus {
  Active = 'Active',
  Suspended = 'Suspended'
}

export interface User {
  id: string;
  fullName: string;
  mobile: string;
  location: string;
  registeredDate: string;
  coinBalance: number;
  status: UserStatus;
}

export enum ExpertStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export enum ExpertOnlineStatus {
  Online = 'Online',
  Offline = 'Offline'
}

export enum ExpertVerificationStatus {
  Pending = 'pending',
  Verified = 'verified',
  Rejected = 'rejected'
}

export interface LocationInfo {
  region: string;
  district: string;
  upazila: string;
  village: string;
}

export interface Credentials {
  degreeCertificateUrl?: string; // image/PDF in storage
  professionalIdUrl?: string; // NID/ID image
}

export interface ExpertMetadata {
  createdAt: string;
  updatedAt: string;
  ratingAvg?: number;
}

export interface ConsultRequest {
  id: string;
  farmerId: string;
  fieldId: string;
  hazardType: 'flood' | 'pest' | 'soil' | 'salinity';
  shortProblem: string; // 1-2 line summary
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  linkedConsultationId?: string; // set when converted to consultation
}

export interface Payment {
  amount: number;
  status: 'pending' | 'paid';
  paymentRef?: string; // ID in payments node
}

export interface ConsultationMetadata {
  createdAt: string;
  updatedAt: string;
}

export interface Consultation {
  id: string;
  farmerId: string;
  fieldId: string;
  requestId?: string; // origin request (optional)
  channel: 'call' | 'voice_note' | 'sms';
  consultedAt: string;
  reportPdfUrl?: string; // expert's PDF report in storage
  reportSummary?: string; // 1-3 lines text
  farmerRating?: number; // number 1-5
  payment?: Payment;
  metadata?: ConsultationMetadata;
}

export interface Expert {
  id: string;
  name: string;
  phone: string;
  email?: string;
  profilePhotoUrl?: string;
  bio?: string;
  locationInfo: LocationInfo;
  educationalQualification?: string; // e.g. "BSc Ag, MSc Soil Science"
  currentAffiliation?: string; // e.g. "DAE Patuakhali"
  yearsOfExperience?: number;
  areasOfSpecialization?: string[]; // ["Soil Science","Pest Management",...]
  credentials?: Credentials;
  paymentPerReport?: number; // number, e.g. 50 (Tk)
  hasAvailable?: boolean; // true/false – ready to take cases
  verificationStatus: ExpertVerificationStatus;
  metadata?: ExpertMetadata;
  consultRequests?: { [key: string]: ConsultRequest }; // incoming requests
  consultations?: { [key: string]: Consultation }; // completed or in-progress cases
}

export interface Report {
  id: string;
  sessionId: string;
  reportedBy: string;
  expertName: string;
  farmerName: string;
  issue: string;
  dateReported: string;
  status: 'New' | 'In Review' | 'Resolved';
}

export interface Feedback {
  id: string;
  date: string;
  farmerName: string;
  expertName: string;
  rating: number;
  text: string;
}

export interface IoTDevice {
  id: string;
  assignedUser: string;
  location: string;
  lastPing: string;
  batteryLevel: number;
  status: 'Active' | 'Offline' | 'Error';
  lat: number;
  lng: number;
}

export interface Transaction {
  id: string;
  userName: string;
  userPhone: string;
  coins: number;
  amount: number;
  date: string;
  status: 'Success' | 'Pending' | 'Failed';
}

export interface Payout {
  id: string;
  expertName: string;
  coins: number;
  amount: number;
  date: string;
  status: 'Processing' | 'Completed' | 'Failed';
}

export interface CarbonEmissionData {
  id: string;
  farmerName: string;
  fieldName: string;
  emission: number; // in kg CO2e
  date: string;
}

// Farmer-related interfaces matching Firebase structure

export interface SubscriptionHistory {
  id: string;
  paidOn: string;
  duration: string;
  paidAmount: number;
  method: string;
  recordedBy: string;
}

export interface Alert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
}

export interface ExpertConsultation {
  expertId: string;
  expertName?: string;
  advice: string;
  timestamp: string;
}

export interface AIConsultation {
  problems: string[];
  solutions: string[];
  carbonSavings: string | number;
  timestamp: string;
}

export interface Alert {
  type: string;
  severity: string;
  summary: string;
  evidence?: string;
  timestamp?: string;
}

export interface SensorReading {
  id: string;
  soilTemp: number;
  soilMoisture: number;
  timestamp: string;
}

export interface IoTDeviceInfo {
  macId: string;
  installedOn: string;
}

export interface CarbonSequestration {
  ndvi: number;
  carbonPerHa: number;
  totalCarbon: number;
  revenue: number;
  method: string;
  lastUpdated: string;
}

export interface CarbonEmission {
  id: string;
  amountKg: number;
  source: string;
  timestamp: string;
}

export interface Field {
  id: string;
  fieldSize: string;
  cropType: string;
  soilType: string;
  location: {
    lat: number;
    lon: number;
  };
  currentCrop: {
    name: string;
    plantedOn: string;
  };
  latestPrediction: {
    floodRisk: string;
    salinityRisk: string;
    nitrogenStatus: string;
    generatedOn: string;
  };
  expertConsultations?: { [key: string]: ExpertConsultation };
  aiConsultations?: { [key: string]: AIConsultation };
  alerts?: { [key: string]: Alert };
  iot?: {
    deviceInfo: IoTDeviceInfo;
    sensorReadings?: { [key: string]: SensorReading };
  };
  carbonSequestration?: CarbonSequestration;
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  photoUrl?: string;
  nidUrl?: string;
  region: string;
  district: string;
  upazila: string;
  village: string;
  hasSubscription: boolean;
  subscriptionType?: string;
  subscriptionValidTill?: string;
  termsAccepted: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  subscriptionHistory?: { [key: string]: SubscriptionHistory };
  fields?: { [key: string]: Field };
}
