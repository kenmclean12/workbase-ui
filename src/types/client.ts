export type ClientResponseDto = {
  id: number;
  createdAt: string;
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  address: {
    id: number;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    clientId: number;
  } | null;
};
