import type { Address } from "./address";

export type Client = {
  id: number;
  name: string;
  createdAt: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  address: Address | null;
};

const streetNames = [
  "Ocean View",
  "Maple",
  "Harbour",
  "Cedar",
  "Elm",
  "Riverbend",
  "Park",
  "Willow",
  "Summit",
  "Sunset",
];

const streetTypes = ["Dr", "St", "Ave", "Rd", "Boulevard", "Lane", "Terrace"];
const cities = [
  "Victoria",
  "Nanaimo",
  "Vancouver",
  "Kelowna",
  "Sidney",
  "Squamish",
  "Chilliwack",
  "Surrey",
  "Richmond",
  "Burnaby",
];
const states = ["BC", "ON", "QC"];
const countries = ["Canada", "Canada", "Canada", "Canada", "United States"];

const sampleAddresses: Address[] = Array.from({ length: 50 }, (_, index) => {
  const id = index + 1;
  const streetNumber = 100 + id;
  const streetName = streetNames[index % streetNames.length];
  const streetType = streetTypes[index % streetTypes.length];
  const city = cities[index % cities.length];
  const state = states[index % states.length];
  const country = countries[index % countries.length];
  const postalCode = `${state[0]}${(id % 9) + 1}${String(id).padStart(1, "0")} ${String(
    (id * 3) % 9,
  )}${String((id * 5) % 9)}${String((id * 7) % 9)}`;

  return {
    id,
    street: `${streetNumber} ${streetName} ${streetType}`,
    city,
    state,
    country,
    postalCode,
    clientId: id,
  };
});

export const clients: Client[] = Array.from({ length: 50 }).map((_, index) => {
  const id = index + 1;
  const hasAddress = id % 3 === 0 || id % 7 === 0;

  return {
    id,
    name: `Client ${id}`,
    createdAt: new Date(2025, id % 12, (id % 28) + 1).toISOString(),
    email: id % 2 === 0 ? `client${id}@email.com` : null,
    phone: id % 5 === 0 ? `+1-250-555-${1000 + id}` : null,
    website: id % 4 === 0 ? `https://client${id}.com` : null,
    description: id % 6 === 0 ? `Description for client ${id}` : null,
    address: hasAddress ? sampleAddresses[id - 1] : null,
  };
});
