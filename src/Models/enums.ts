// Function to get the display name for an order status
export const getStatusName = (value: OrderStatus): string => {
  switch (value) {
    case OrderStatus.ReadyForPickup:
      return "Ready for Pickup";
    default:
      return OrderStatus[value];
  }
};

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
export const getStatusName = (value: OrderStatus): string => {
  switch (value) {
    case OrderStatus.ReadyForPickup:
      return "Ready for Pickup";
    default:
      return OrderStatus[value];
  }
};
export const getLanguageName = (value: Language): string => Language[value];
export const getFormatName = (value: BookFormat): string => BookFormat[value];

// Convert string to enum
export function parseAnnouncementType(value: string | AnnouncementType): AnnouncementType {
  if (typeof value === 'string') {
    return AnnouncementType[value as keyof typeof AnnouncementType];
  }
  return value;
}

// Convert enum to display string
export const getAnnouncementTypeName = (value: string | AnnouncementType): string => {
  const type = typeof value === 'string' ? parseAnnouncementType(value) : value;
  return AnnouncementType[type].replace(/([A-Z])/g, ' $1').trim();
};
