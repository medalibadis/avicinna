import { ConsultationInquiry } from '@/context/DataContext';

// Production baseline: zero demo or test leads.
// Real patient consultation submissions arrive via POST /api/consultation.
export const initialInquiriesData: ConsultationInquiry[] = [];
