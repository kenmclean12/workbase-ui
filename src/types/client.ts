export type ClientAddressCreateDto = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

export type ClientCreateDto = {
  name: string;
  initUserEmail: string;
  addressDTO?: ClientAddressCreateDto;
  email?: string;
  phone?: string;
  website?: string;
  description?: string;
};

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
