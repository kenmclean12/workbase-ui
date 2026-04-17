export type Address = {
  id: number;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  clientId: number;
};

export const addresses: Address[] = [
  {
    id: 1,
    street: "12 Ocean View Dr",
    city: "Victoria",
    state: "BC",
    country: "Canada",
    postalCode: "V8V 1A1",
    clientId: 1,
  },
  {
    id: 2,
    street: "88 Maple St",
    city: "Nanaimo",
    state: "BC",
    country: "Canada",
    postalCode: "V9R 2H6",
    clientId: 2,
  },
  {
    id: 3,
    street: "1400 Main Rd",
    city: "Vancouver",
    state: "BC",
    country: "Canada",
    postalCode: "V6B 2K3",
    clientId: 3,
  },
  {
    id: 4,
    street: "55 Riverbend Ave",
    city: "Kelowna",
    state: "BC",
    country: "Canada",
    postalCode: "V1Y 6J4",
    clientId: 5,
  },
  {
    id: 5,
    street: "9 Harbour St",
    city: "Sidney",
    state: "BC",
    country: "Canada",
    postalCode: "V8L 2W9",
    clientId: 8,
  },
];
