export interface AuthorDto {
  id: string;
  name: string;
  email?: string;
  bookCount: number;
  createdAt: Date;
  lastUpdated?: Date;
}

export interface CreateAuthorDto {
  name: string;
  email?: string;
}

export interface UpdateAuthorDto {
  name?: string;
  email?: string;
}
