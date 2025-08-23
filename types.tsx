type Attribute = {
  id: number
  name: string,
  code: string,
};

export type Advert = {
 id: number,
 type: AdvertType,
 title: string,
 description: string,
 price?: number|null,
 previousPrice?: number|null,
 currency: string,
 sourceUrl: string,
 externalUrl: string,
 property: Property,
 source: Source,
};

export type AdvertType = Attribute;

export type Property = {
  id: number,
  type: PropertyType,
  disposition: PropertyDisposition,
  construction: PropertyConstruction,
  condition: PropertyCondition,
  ownership: string,
  floor: number,
  area: number,
  location: Location,
  images: PropertyImage[],
};

export type PropertyType = Attribute;

export type PropertyDisposition = Attribute;

export type PropertyConstruction = Attribute;

export type PropertyCondition = Attribute;

export type PropertyImage = {
  thumbnail: string,
  image: string,
}

export type Location = {
  id: number,
  street: string,
  city: City,
  cityDistrict: CityDistrict,
};

export type City = Attribute;

export type CityDistrict = Attribute;

export type Source = Attribute;

export type Filters = {
  advertType: string,
  propertyType: string,
  propertySubtype: { [key: string]: { [key: string]: boolean } },
  minPrice: number,
  maxPrice: number,
  disposition: { [key: string]: boolean },
  cityCode?: string,
  cityDistrict?: { [key: string]: boolean},
  districtCode?: string,
  compactView?: boolean,
};

export type FiltersPartial = {
  advertType?: string,
  propertyType?: string,
  propertySubtype?: { [key: string]: { [key: string]: boolean } },
  minPrice?: number,
  maxPrice?: number,
  disposition?: { [key: string]: boolean },
  cityCode?: string,
  cityDistrict?: { [key: string]: boolean },
  districtCode?: string,
};

export type FiltersPayload = {
  advertType: string,
  propertyType: string,
  propertySubtype?: string[],
  cityCode?: string,
  districtCode?: string,
  cityDistrict?: string[],
  disposition: string[],
  price?: {
    lte?: number,
    gte?: number
  },
};

export type Settings = {
  notificationsEnabled: boolean,
  filters: Filters[],
};

export type SettingsPartial = {
  notificationsEnabled?: boolean,
  filters?: Filters[],
};

export enum AdvertTypeEnum {
  sale = 'sale',
  rent = 'rent'
}