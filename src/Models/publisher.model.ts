export interface PublisherDto {
  id: string;
  name: string;
  email?: string;
  bookCount: number;
  createdAt: Date;
  lastUpdated?: Date;
}

export interface CreatePublisherDto {
  name: string;
  email?: string;
}

export interface UpdatePublisherDto {
  name?: string;
  email?: string;
}
