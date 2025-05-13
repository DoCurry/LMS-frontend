export enum Language {
  English,
  Nepali,
  Hindi,
  Spanish
}

export enum BookFormat {
  Paperback,
  Hardcover,
  Exclusive
}

export enum Genre {
  Action,
  Comedy,
  Drama,
  Horror,
  SciFi,
  Romance
}

export enum OrderStatus {
  Pending,
  ReadyForPickup,
  Completed,
  Cancelled
}

export enum UserRole {
  Member,
  Admin,
  Staff
}

export enum AnnouncementType {
  Deal,
  NewArrival,
  Information
}

// Helper functions to get enum names
// Get array of enum values (filtering out reverse mappings)
export const getEnumValues = <T extends { [key: string]: string | number }>(enumObj: T) => {
  return Object.keys(enumObj)
    .filter(key => isNaN(Number(key)))
    .map(key => enumObj[key] as number);
};

// Helper functions to get enum names
export const getGenreName = (value: Genre): string => Genre[value];
export const getLanguageName = (value: Language): string => Language[value];
export const getFormatName = (value: BookFormat): string => BookFormat[value];
