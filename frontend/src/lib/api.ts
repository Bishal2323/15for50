export type BackendRole = 'Athlete' | 'Coach' | 'Physiotherapist' | 'Admin';
export type FrontendRole = 'athlete' | 'coach' | 'physio' | 'admin';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/v1';

function mapRole(role: BackendRole): FrontendRole {
  switch (role) {
    case 'Athlete': return 'athlete';
    case 'Coach': return 'coach';
    case 'Physiotherapist': return 'physio';
    case 'Admin': return 'admin';
    default: return 'athlete';
  }
}

function toBackendRole(role: FrontendRole): BackendRole {
  switch (role) {
    case 'athlete': return 'Athlete';
    case 'coach': return 'Coach';
    case 'physio': return 'Physiotherapist';
    case 'admin': return 'Admin';
    default: return 'Athlete';
  }
}

import type { User as FrontendUser } from '@/types/user'

export async function loginApi(email: string, password: string): Promise<{ token: string; user: FrontendUser }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    let msg = 'Login failed';
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch { }
    throw new Error(msg);
  }
  const data = await res.json();
  const user: FrontendUser = {
    id: data.user.id as string,
    email: data.user.email as string,
    role: mapRole(data.user.role as BackendRole),
    name: (data.user.name as string) || (data.user.email as string),
    gender: ((data.user.gender as string | undefined)?.toLowerCase() === 'female') ? 'female' : 'male',
    aclRisk: (typeof data.user.aclRisk === 'number') ? data.user.aclRisk : null,
  }
  return { token: data.access_token as string, user };
}

// Helper function to get auth headers
export function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
}

// Admin API functions
export interface User {
  _id: string;
  email: string;
  role: BackendRole;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalUsers: number;
  usersByRole: Record<string, number>;
  recentUsers: User[];
}

export interface PaginatedUsers {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function getAdminStats(): Promise<UserStats> {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch admin stats');
  }
  return res.json();
}

export async function getUsers(params?: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}): Promise<PaginatedUsers> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.role) searchParams.set('role', params.role);
  if (params?.search) searchParams.set('search', params.search);

  const res = await fetch(`${API_BASE}/admin/users?${searchParams}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch users');
  }
  return res.json();
}

// Physio: search users (non-admin), supports role and email search
export async function getPhysioUsers(params?: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}): Promise<PaginatedUsers> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.role) searchParams.set('role', params.role);
  if (params?.search) searchParams.set('search', params.search);

  const res = await fetch(`${API_BASE}/physio/users?${searchParams}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch users');
  }
  return res.json();
}

export async function getUser(id: string): Promise<{ user: User }> {
  const res = await fetch(`${API_BASE}/admin/users/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch user');
  }
  return res.json();
}

// Current user profile
export async function getMe(): Promise<{ user: { id: string; name?: string; email: string; role: BackendRole; teamId?: string; gender?: 'male' | 'female'; age?: number; heightCm?: number; weightKg?: number; bmi?: number; aclRisk?: number | null } }> {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch current user');
  }
  return res.json();
}

// Self account deletion
export async function deleteMyAccount(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to delete account');
  }
  return res.json();
}

export async function updateUser(id: string, updates: {
  email?: string;
  role?: BackendRole;
  teamId?: string;
}): Promise<{ user: User; message: string }> {
  const res = await fetch(`${API_BASE}/admin/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to update user');
  }
  return res.json();
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/admin/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to delete user');
  }
  return res.json();
}

export async function deleteUsersByRole(role: BackendRole): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/admin/users?role=${encodeURIComponent(role)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to delete users with role ${role}`);
  }
  return res.json();
}

export async function createUser(userData: {
  email: string;
  password: string;
  role: BackendRole;
  teamId?: string;
}): Promise<{ user: User; message: string }> {
  const res = await fetch(`${API_BASE}/admin/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to create user');
  }
  return res.json();
}

export async function resetUserPassword(id: string, newPassword: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/admin/users/${id}/reset-password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ newPassword }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to reset password');
  }
  return res.json();
}

export async function signupApi(email: string, password: string, role: FrontendRole): Promise<{ token: string; user: FrontendUser }> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role: toBackendRole(role) }),
  });
  if (!res.ok) {
    let msg = 'Signup failed';
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch { }
    throw new Error(msg);
  }
  const data = await res.json();
  const user: FrontendUser = {
    id: data.user.id as string,
    email: data.user.email as string,
    role: mapRole(data.user.role as BackendRole),
    name: (data.user.name as string) || (data.user.email as string),
    gender: ((data.user.gender as string | undefined)?.toLowerCase() === 'female') ? 'female' : 'male',
    aclRisk: (typeof data.user.aclRisk === 'number') ? Number(data.user.aclRisk) : null,
  };
  return { token: data.access_token as string, user };
}

// Athlete onboarding API
export interface AthleteOnboardingPayload {
  name?: string;
  gender?: 'male' | 'female';
  age?: number;
  heightInches?: number;
  weightPounds?: number;
  // Also accept metric if client prefers
  heightCm?: number;
  weightKg?: number;
}

export async function postAthleteOnboarding(payload: AthleteOnboardingPayload): Promise<{ message: string; user: any }> {
  const res = await fetch(`${API_BASE}/auth/onboarding`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to complete onboarding');
  }
  return res.json();
}

// Update profile API (expects metric units)
export async function updateMyProfile(payload: Partial<{ name: string; gender: 'male' | 'female'; age: number; heightCm: number; weightKg: number }>): Promise<{ message: string; user: any }> {
  const res = await fetch(`${API_BASE}/auth/update-profile`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to update profile');
  }
  return res.json();
}

// Patients API (Physiotherapist)
export type Severity = 'small' | 'middle' | 'severe';
export interface Patient {
  _id: string;
  name: string;
  details: string;
  severity: Severity;
  physioId: string;
  createdAt: string;
  updatedAt: string;
}

export async function getMyPatients(): Promise<{ patients: Patient[] }> {
  const res = await fetch(`${API_BASE}/patients`, { headers: getAuthHeaders() });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch patients');
  }
  return res.json();
}

export async function createPatient(payload: { name: string; details?: string; severity: Severity }): Promise<{ patient: Patient }> {
  const res = await fetch(`${API_BASE}/patients`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to create patient');
  }
  return res.json();
}

export async function updatePatient(id: string, payload: Partial<{ name: string; details: string; severity: Severity }>): Promise<{ patient: Patient }> {
  const res = await fetch(`${API_BASE}/patients/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to update patient');
  }
  return res.json();
}

export async function deletePatient(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/patients/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to delete patient');
  }
  return res.json();
}

// Notifications API
export type NotificationStatus = 'pending' | 'accepted' | 'declined';
export type NotificationType = 'CoachInvite' | 'DirectMessage';

export interface Notification {
  _id: string;
  recipientUserId: string;
  senderUserId: string;
  type: NotificationType;
  status: NotificationStatus;
  message?: string;
  metadata?: {
    coachId?: string;
    athleteId?: string;
    messageId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function getNotificationsForUser(userId: string): Promise<{ notifications: Notification[] }> {
  const res = await fetch(`${API_BASE}/notifications/${userId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch notifications');
  }
  return res.json();
}

export async function acceptNotification(notificationId: string): Promise<{ notification: Notification; message: string }> {
  const res = await fetch(`${API_BASE}/notifications/${notificationId}/accept`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to accept notification');
  }
  return res.json();
}

export async function declineNotification(notificationId: string): Promise<{ notification: Notification; message: string }> {
  const res = await fetch(`${API_BASE}/notifications/${notificationId}/decline`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to decline notification');
  }
  return res.json();
}

// Messaging API: send message to coach or physiotherapist with optional attachments
export async function sendMessage(params: { recipient: 'coach' | 'physio'; message?: string; attachments?: File[] }): Promise<{ message: any; notification: Notification }> {
  const token = localStorage.getItem('access_token') || '';
  const form = new FormData();
  form.append('recipient', params.recipient);
  if (params.message) form.append('message', params.message);
  (params.attachments || []).forEach((file) => {
    form.append('attachments', file);
  });

  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Authorization': token ? `Bearer ${token}` : '' },
    body: form,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to send message');
  }
  return res.json();
}

// Messaging API: send message directly to a specific userId (e.g., coach replying to athlete)
export async function sendMessageToUser(params: { recipientUserId: string; message?: string; attachments?: File[] }): Promise<{ message: any; notification: Notification }> {
  const token = localStorage.getItem('access_token') || '';
  const form = new FormData();
  form.append('recipientUserId', params.recipientUserId);
  if (params.message) form.append('message', params.message);
  (params.attachments || []).forEach((file) => {
    form.append('attachments', file);
  });

  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Authorization': token ? `Bearer ${token}` : '' },
    body: form,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to send message');
  }
  return res.json();
}

// Coach API
export async function getCoachAthletes() {
  const res = await fetch(`${API_BASE}/coach/athletes`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch coach athletes');
  }
  return res.json() as Promise<{ athletes: Array<{ _id: string; email: string; role: BackendRole; teamId?: string; coachId?: string; createdAt: string; updatedAt: string }> }>
}

export async function createAthleteAsCoach(payload: { email: string }) {
  const res = await fetch(`${API_BASE}/coach/athletes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email: payload.email })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to create athlete');
  }
  return res.json();
}

// Coach Weekly Reports API
export interface CoachWeeklyReportPayload {
  athleteEmail: string;
  weekStart: string; // YYYY-MM-DD
  weekEnd?: string;  // YYYY-MM-DD
  title?: string;
  trainingFocus?: string;
  highlights?: string[];
  concerns?: string[];
  actionItems?: string[];
  notes?: string;
  // Coach factors (sent top-level; backend wraps into coachMetrics)
  acwr?: number;
  quadricepsLsi?: number;
  hamstringsLsi?: number;
  singleLegHopLsi?: number;
  yBalanceAnteriorDiffCm?: number;
  lessScore?: number;
  slsStabilitySec?: number;
  specificPainChecks?: Array<{ area: string; rating: number }>;
  aggregated?: {
    avgTrainingLoadSRPE?: number;
    avgSleepQuality?: number;
    avgMood?: number;
    athleteCount?: number;
  };
}

export async function createCoachWeeklyReport(payload: CoachWeeklyReportPayload): Promise<{ report: any; message: string }> {
  const res = await fetch(`${API_BASE}/coach/weekly-reports`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to create weekly report');
  }
  return res.json();
}

// Physio Reports API
export interface PhysioReportPayload {
  athleteId?: string;           // prefer athleteId when known
  athleteEmail?: string;        // alternative lookup by email
  assessmentDate: string;       // YYYY-MM-DD
  hqRatio: number;              // (%)
  peakDynamicKneeValgusDeg: number; // (°)
  trunkLeanLandingDeg: number;      // (°)
  cmjPeakPowerWkg: number;          // (W/kg)
  beightonScore: number;            // (0–9)
  anatomicalRisk: string;           // text label
  mvicLsi: number;                  // (%)
  emgOnsetDelayMs: number;          // (ms)
  notes?: string;
}

export async function createPhysioReport(payload: PhysioReportPayload): Promise<{ report: any; message: string }> {
  const res = await fetch(`${API_BASE}/physio/reports`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to create physio report');
  }
  return res.json();
}

export async function getPhysioReports(params?: { athleteId?: string; from?: string; to?: string }): Promise<{ reports: any[] }> {
  const searchParams = new URLSearchParams();
  if (params?.athleteId) searchParams.set('athleteId', params.athleteId);
  if (params?.from) searchParams.set('from', params.from);
  if (params?.to) searchParams.set('to', params.to);

  const res = await fetch(`${API_BASE}/physio/reports?${searchParams.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch physio reports');
  }
  return res.json();
}

// Daily Report API
export interface DailyReportData {
  // Date field for the report
  date?: string;

  // Sleep & Recovery
  sleepHours?: number;
  sleepQuality?: number;

  // Physical State
  fatigueLevel?: number;
  stressLevel?: number;
  jointStrain?: number;
  readinessToTrain?: number;

  // Mental State
  mood?: number;
  nonSportStressors?: number;
  nonSportStressorsNotes?: string;

  // Training (Optional)
  trainingDuration?: number;
  trainingIntensity?: number;
  trainingRPE?: number;
  trainingLoadSRPE?: number;

  // Female Athletes (Optional)
  menstrualStatus?: string;

  // Body Map Data
  bodyAttributes?: {
    [bodyPart: string]: {
      soreness?: number | null;
      redness?: number | null;
      swelling?: number | null;
      notes?: string;
    };
  };

  // General
  notes?: string;

  // Legacy fields for backward compatibility
  kneeStabilityL?: number;
  kneeStabilityR?: number;
  comments?: string;
}

export async function submitDailyReport(reportData: DailyReportData): Promise<{ report: any; riskScore: any; message: string }> {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reportData),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to submit daily report');
  }
  return res.json();
}
