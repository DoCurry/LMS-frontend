import { AnnouncementType } from './enums';

export interface AnnouncementDto {
  id: string;
  title: string;
  content: string;
  startDate: Date;
  endDate: Date;
  type: AnnouncementType;
  isActive: boolean;
  createdAt: Date;
  lastUpdated?: Date;
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  startDate: Date;
  endDate: Date;
  type: AnnouncementType;
}

export interface UpdateAnnouncementDto {
  title?: string;
  content?: string;
  startDate?: Date;
  endDate?: Date;
  type?: AnnouncementType;
  isActive?: boolean;
}
