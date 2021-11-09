import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  NotFound: undefined;
};

export type SaleStackParamList = {
  SaleList: undefined
  SaleDetail: { id: number };
};

export type RentStackParamList = {
  RentList: undefined;
  RentDetail: { id: number };
};

export type RootTabParamList = {
  Sale: NavigatorScreenParams<SaleStackParamList> | undefined;
  Rent: NavigatorScreenParams<RentStackParamList> | undefined;
  Notifications: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type SaleStackScreenProps<Screen extends keyof SaleStackParamList> = NativeStackScreenProps<
  SaleStackParamList,
  Screen
>;

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
  minPrice: number,
  maxPrice: number,
  disposition: { [key: string]: boolean },
  cityCode: string,
  cityDistrict: { [key: string]: boolean}|null,
};

export type FiltersPartial = {
  advertType?: string,
  minPrice?: number,
  maxPrice?: number,
  disposition?: { [key: string]: boolean },
  cityCode?: string,
  cityDistrict?: { [key: string]: boolean }|null,
};

export type FiltersPayload = {
  advertType: string,
  cityCode: string,
  cityDistrict?: string[],
  disposition: string[],
  price?: {
    lte?: number,
    gte?: number
  },
};

export type Settings = {
  notificationsEnabled: boolean,
  filters: { [key: string]: Filters },
};

export type SettingsPartial = {
  notificationsEnabled?: boolean,
  filters?: { [key: string]: Filters },
};
