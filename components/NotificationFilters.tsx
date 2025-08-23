import React, { useState } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Locations from '@/constants/Locations';
import { AdvertTypeEnum, Filters, FiltersPartial } from '@/types';
import { capitalize, currencyFormatter, locationsCodeMap } from '@/services/utils';

export default function NotificationFilters({ filtersInput, filtersKey, submitFilters }: {
  filtersInput: Filters,
  filtersKey: number,
  submitFilters: (key: number, filters: Filters) => Promise<void>
}) {
  const [filters, setFilters] = useState(filtersInput ?? {
    editmode: true,
    advertType: 'sale',
    propertyType: 'flat',
    minPrice: 0,
    maxPrice: 0,
    disposition: {
      '1': false,
      '1+kk': false,
      '1+1': false,
      '2+kk': false,
      '2+1': false,
      '3+kk': false,
      '3+1': false,
      '4+kk': false,
      '4+1': false,
      '5+kk': false,
      '5+1': false,
      '6+': false,
      'other': false,
    },
    cityCode: Locations.brno.code,
    cityDistrict: Locations.brno.districtSettings,
    districtCode: undefined,
    propertySubtype: {
      'house': {
        'house': false,
        'cottage': false,
        'garrage': false,
        'farm': false,
        'other': false,
      },
      'land': {
        'property': false,
        'field': false,
        'woods': false,
        'plantation': false,
        'garden': false,
        'other': false,
      }
    },
  });
  const [minPrice, setMinPrice] = useState(filtersInput?.minPrice ?? 0);
  const [maxPrice, setMaxPrice] = useState(filtersInput?.maxPrice ?? 0);

  const salePriceLimit = 10000000;
  const salePriceStep = 100000;
  const rentPriceLimit = 50000;
  const rentPriceStep = 1000;
  let minPriceSliderTimeoutId: NodeJS.Timeout;
  let maxPriceSliderTimeoutId: NodeJS.Timeout;

  const onAdvertTypeChange = (value: string) => {
    persistFilters({advertType: value});
  };

  const onPropertyTypeChange = (value: string) => {
    const f = JSON.parse(JSON.stringify(filters));

    if (value === 'land') {
      Object.keys(f.disposition).forEach(key => f.disposition[key] = false);
      Object.keys(f.propertySubtype['house']).forEach(key => f.propertySubtype['house'][key] = false);
    } else if (value === 'house') {
      Object.keys(f.propertySubtype['land']).forEach(key => f.propertySubtype['land'][key] = false);
    } else {
      Object.keys(f.propertySubtype['house']).forEach(key => f.propertySubtype['house'][key] = false);
      Object.keys(f.propertySubtype['land']).forEach(key => f.propertySubtype['land'][key] = false);
    }

    persistFilters({propertyType: value, disposition: f.disposition, propertySubtype: f.propertySubtype});
  };

  const onLocationChange = (value: string) => {
    const key = locationsCodeMap[value];

    if (!key) {
      return;
    }
    const districtSettings = Locations[key].districtSettings;

    persistFilters({
      cityCode: Locations[key].type === 'city' ? value : undefined,
      districtCode: Locations[key].type === 'district' ? value : undefined,
      cityDistrict: districtSettings,
    });
  };

  const onMinPriceChange = (value: number) => {
    setMinPrice(value);
  };

  const onMinPriceChangeComplete = (value: number) => {
    clearTimeout(minPriceSliderTimeoutId)
    minPriceSliderTimeoutId = setTimeout(() => {
      const f = JSON.parse(JSON.stringify(filters));
      f.minPrice = value;
      persistFilters(f);
    }, 50)
  };

  const onMaxPriceChange = (value: number) => {
    setMaxPrice(value);
  };

  const onMaxPriceChangeComplete = (value: number) => {
    clearTimeout(maxPriceSliderTimeoutId)
    maxPriceSliderTimeoutId = setTimeout(() => {
      const f = JSON.parse(JSON.stringify(filters));
      f.maxPrice = value;
      persistFilters(f);
    }, 50)
  }

  const onDispositionEnabledChange = (disposition: string, value: boolean) => {
    const f = JSON.parse(JSON.stringify(filters));
    f.disposition[disposition] = value;
    persistFilters(f);
  };

  const onSubtypeEnabledChange = (propertyType: string, propertySubtype: string, value: boolean) => {
    const f = JSON.parse(JSON.stringify(filters));
    f.propertySubtype[propertyType][propertySubtype] = value;
    persistFilters(f);
  };

  const onCityDistrictEnabledChange = (cityDistrict: string, value: boolean) => {
    const f = JSON.parse(JSON.stringify(filters));
    f.cityDistrict[cityDistrict] = value;
    persistFilters(f);
  };

  const mergeFilters = (newFilters: FiltersPartial) => {
    return {...filters, ...newFilters};
  };

  const persistFilters = (newFilters: FiltersPartial) => {
    const filters = mergeFilters(newFilters);

    submitFilters(filtersKey, filters).then(
      () => setFilters(filters),
      () => {
        setMinPrice(filtersInput?.minPrice ?? 0)
        setMaxPrice(filtersInput?.maxPrice ?? 0)
      });
  };

  const renderDispositionFilter = () => {
    const { disposition } = filters;

    return Object.keys(disposition).map((key) => {
      return (
        <View style={styles.dispositionSwitchContainer} key={key}>
          <Text style={styles.textLabel}>{key}</Text>
          <Switch
            value={disposition[key]}
            onValueChange={(value) => {onDispositionEnabledChange(key, value)}}
            trackColor={{false: Colors.buttonOff, true: Colors.buttonLight}}
            thumbColor={disposition[key] ? Colors.button : Colors.buttonOffLight}
          />
        </View>
      );
    });
  };

  const renderSubtypeFilter = () => {
    const { propertySubtype, propertyType } = filters;

    if (!propertySubtype[propertyType]) {
      return <></>;
    }

    return Object.keys(propertySubtype[propertyType]).map((key) => {
      return (
        <View style={styles.subtypeSwitchContainer} key={key}>
          <Text style={styles.textLabel}>{key}</Text>
          <Switch
            value={propertySubtype[propertyType][key]}
            onValueChange={(value) => {onSubtypeEnabledChange(propertyType, key, value)}}
            trackColor={{false: Colors.buttonOff, true: Colors.buttonLight}}
            thumbColor={propertySubtype[propertyType][key] ? Colors.button : Colors.buttonOffLight}
          />
        </View>
      );
    });
  };

  const renderCityDistrictFilter = () => {
    const { cityDistrict, cityCode } = filters;

    const key = locationsCodeMap[cityCode ?? ''];
    const districts = Locations[key]?.districts;

    if (!cityDistrict || !districts) {
      return;
    }

    return Object.keys(cityDistrict).map((key) => {
      return (
        <View style={styles.cityDistrictSwitchContainer} key={key}>
          <Text style={styles.textLabel}>{districts?.[key]}</Text>
          <Switch
            value={cityDistrict[key]}
            onValueChange={(value) => {onCityDistrictEnabledChange(key, value)}}
            trackColor={{false: Colors.buttonOff, true: Colors.buttonLight}}
            thumbColor={cityDistrict[key] ? Colors.button : Colors.buttonOffLight}
          />
        </View>
      );
    });
  };

  const renderLocationOptions = () => {
    return Object.keys(Locations).map((location) => {
      return (
        <Picker.Item key={location} label={Locations[location].label} value={Locations[location].code} />
      );
    });
  };

  return (
    <View>
      {
        filtersInput?.compactView ?
          <View style={styles.compactViewContainer}>
            <View style={styles.compactViewContainerItem}>
              <Text style={styles.textLabel}>
                {Locations[locationsCodeMap[filters.cityCode ?? '']]?.label}
              </Text>
              { !filters.minPrice ? <></> :
                <Text style={styles.textLabelSmall}>
                  min: {currencyFormatter.format((filters.minPrice))}
                </Text>
              }
            </View>
            <View style={styles.compactViewContainerItem}>
              <Text style={styles.textLabel}>
                {capitalize(filters.propertyType)} - {capitalize(filters.advertType)}
              </Text>
              { !filters.maxPrice ? <></> :
                <Text style={styles.textLabelSmall}>
                  max: {currencyFormatter.format((filters.maxPrice))}
                </Text>
              }
            </View>
          </View>
          :
          <View>
            <View style={styles.pickerContainer}>
              <Text style={styles.textLabel}>
                Ad type
              </Text>
              <Picker
                selectedValue={filters.advertType}
                onValueChange={onAdvertTypeChange}
                style={styles.advertTypePicker}
                mode="dropdown"
              >
                <Picker.Item label="Sale" value={AdvertTypeEnum.sale} />
                <Picker.Item label="Rent" value={AdvertTypeEnum.rent} />
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.textLabel}>
                Property type
              </Text>
              <Picker
                selectedValue={filters.propertyType}
                onValueChange={onPropertyTypeChange}
                style={styles.propertyTypePicker}
                mode="dropdown"
              >
                <Picker.Item label="Flat" value="flat" />
                <Picker.Item label="House" value="house" />
                <Picker.Item label="Land" value="land" />
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.textLabel}>
                Location
              </Text>
              <Picker
                selectedValue={filters.cityCode ?? filters.districtCode}
                onValueChange={onLocationChange}
                style={styles.cityPicker}
                mode="dropdown"
              >
                { renderLocationOptions() }
              </Picker>
            </View>

            <View style={styles.sliderLabelContainer}>
              <Text style={styles.textLabel}>
                Minimum price
              </Text>
              <Text style={styles.textLabel}>
                {minPrice !== 0 ? currencyFormatter.format(filters.minPrice) : ''}
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={filters.advertType === 'sale' ? salePriceLimit : rentPriceLimit}
              step={filters.advertType === 'sale' ? salePriceStep : rentPriceStep}
              value={minPrice}
              onValueChange={(value) => onMinPriceChange(value)}
              onSlidingComplete={(value) => onMinPriceChangeComplete(value)}
              thumbTintColor={Colors.button}
              minimumTrackTintColor={Colors.buttonLight}
              maximumTrackTintColor={Colors.buttonOff}
            />
            <View style={styles.sliderLabelContainer}>
              <Text style={styles.textLabel}>
                Maximum price
              </Text>
              <Text style={styles.textLabel}>
                {maxPrice !== 0 ? currencyFormatter.format(filters.maxPrice) : ''}
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={filters.advertType === 'sale' ? salePriceLimit : rentPriceLimit}
              step={filters.advertType === 'sale' ? salePriceStep : rentPriceStep}
              value={maxPrice}
              onValueChange={(value) => onMaxPriceChange(value)}
              onSlidingComplete={(value) => onMaxPriceChangeComplete(value)}
              thumbTintColor={Colors.button}
              minimumTrackTintColor={Colors.buttonLight}
              maximumTrackTintColor={Colors.buttonOff}
            />
            <View style={styles.subtypeContainer}>
              { (filters.propertyType === 'house' || filters.propertyType === 'land') ? renderSubtypeFilter() : <></> }
            </View>
            <View style={styles.dispositionContainer}>
              { filters.propertyType !== 'land' ? renderDispositionFilter() : <></> }
            </View>
            <View style={styles.cityDistrictContainer}>
              { filters.cityDistrict ? renderCityDistrictFilter() : <></> }
            </View>
          </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  compactViewContainer: {
    marginTop: Layout.sideMargin / 2,
  },
  compactViewContainerItem: {
    flex: 1,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerContainer: {
    flex: 1,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabelContainer: {
    flex: 1,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    marginTop: Layout.sideMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slider: {
    marginBottom: Math.round(Layout.sideMargin / 2),
  },
  dispositionContainer: {
    flex: 1,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    marginTop: Layout.sideMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  dispositionSwitchContainer: {
    width: Math.round((Layout.width - (2 * Layout.sideMargin)) / 3) - Layout.sideMargin,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subtypeContainer: {
    flex: 1,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    marginTop: Layout.sideMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  subtypeSwitchContainer: {
    width: Math.round((Layout.width - (2 * Layout.sideMargin)) / 2) - 2 * Layout.sideMargin,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cityDistrictContainer: {
    flex: 1,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    marginTop: Layout.sideMargin,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  cityDistrictSwitchContainer: {
    width: Math.round((Layout.width - (2 * Layout.sideMargin)) / 2) - 2 * Layout.sideMargin,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textLabel: {
    fontSize: Layout.labelFontSize,
    color: Colors.text,
  },
  textLabelSmall: {
    fontSize: Layout.labelFontSize - 4,
    color: Colors.disabledText,
  },
  text: {
    color: Colors.text,
  },
  advertTypePicker: {
    width: 150,
    color: Colors.text
  },
  propertyTypePicker: {
    width: 150,
    color: Colors.text
  },
  cityPicker: {
    width: 150,
    color: Colors.text
  },
});
