export interface Driver {
  id: number; // Mandatory
  createdAt: Date; // Mandatory
  isBlocked?: boolean;
  acceptanceStatus?: 'accepted' | 'pending' | null;
  augmentedCurrentStatus?: 'active' | 'registration-vehicle' | 'on-duty-active' | null;
  currentRegistrationStep?: 'inspection' | 'vehicle' | null;
  currentStatus: 'active' | 'registration-vehicle' | 'registration-uploads' | 'on-duty' | null; // Mandatory
  lastDevice?: string;
  registrationDevice?: string;
  balance: number; // Mandatory
  ratingsAvg: '5' | '4.5' | '4' | '3.5' | '3' | '2.5' | '2' | '1.5' | '1' | '0.5' | null; // Mandatory
  email?: string;
  firstName: string; // Mandatory
  lastName: string; // Mandatory
  dialCode?: number;
  phone: number; // Mandatory
  city?: string;
  country?: string;
  gender?: string;
  nationality?: string;
  ssn?: number;
  requestsCount?: number;
  requestsAccepted?: number;
  requestsCanceled?: number;
  requestsCanceledByClient?: number;
  requestsCanceledByDriver?: number;
  requestsCompletedRatio?: number;
  requestsFinished?: number;
  vehiclesCount?: number;
  companyId?: number;
  reserverId?: number;
  currentVehicleId?: number;
  lastVehicleId?: number;
  currentCategory?: 'economy' | null;
  lastRefinerId?: number;
  lastRefinerRating?: number;
  lastAcceptedDate?: Date;
  lastRejectedDate?: Date;
  lastRejectionReason?: string;
  lastVehicleDisplay: string;  // Mandatory
  photoUrl?: string;
}

