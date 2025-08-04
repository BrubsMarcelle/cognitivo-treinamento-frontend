export interface CheckinRequest {
  userId: number;
  timestamp: string;
}

export interface CheckinResponse {
  id: number;
  userId: number;
  timestamp: string;
  points: number;
}

export interface CheckinStatusResponse {
  can_checkin: boolean;
  reason: string;
  message: string;
  today: string;
  is_weekend: boolean;
  already_checked_in: boolean;
}
