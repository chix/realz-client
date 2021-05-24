import React, { useState } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Cities from '../constants/Cities';

export default function NotificationFilters({ filtersInput, filtersKey, submitFilters }) {
  const [filters, setFilters] = useState(filtersInput ?? {
    advertType: 'sale',
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
    cityCode: Cities.brno.code,
    cityDistrict: Cities.brno.districtsettings,
  });
  const [minPrice, setMinPrice] = useState(filtersInput?.minPrice ?? 0);
  const [maxPrice, setMaxPrice] = useState(filtersInput?.maxPrice ?? 0);

  const salePriceLimit = 10000000;
  const salePriceStep = 100000;
  const rentPriceLimit = 50000;
  const rentPriceStep = 1000;

  const onAdvertTypeChange = (value) => {
    persistFilters({advertType: value});
  };

  const onMinPriceChange = (value) => {
    setMinPrice(value);
  };

  const onMinPriceChangeComplete = (value) => {
    clearTimeout(minPriceSliderTimeoutId)
    const minPriceSliderTimeoutId = setTimeout(() => {
      const f = JSON.parse(JSON.stringify(filters));
      f.minPrice = value;
      persistFilters(f);
    }, 50)
  };

  const onMaxPriceChange = (value) => {
    setMaxPrice(value);
  };

  const onMaxPriceChangeComplete = (value) => {
    clearTimeout(maxPriceSliderTimeoutId)
    const maxPriceSliderTimeoutId = setTimeout(() => {
      const f = JSON.parse(JSON.stringify(filters));
      f.maxPrice = value;
      persistFilters(f);
    }, 50)
  }

  const onDispositionEnabledChange = (disposition, value) => {
    const f = JSON.parse(JSON.stringify(filters));
    f.disposition[disposition] = value;
    persistFilters(f);
  };

  const onCityDistrictEnabledChange = (cityDistrict, value) => {
    const f = JSON.parse(JSON.stringify(filters));
    f.cityDistrict[cityDistrict] = value;
    persistFilters(f);
  };

  const mergeFilters = (newFilters) => {
    return {...filters, ...newFilters};
  };

  const persistFilters = (newFilters) => {
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

  const renderCityDistrictFilter = () => {
    const { cityDistrict } = filters;

    return Object.keys(cityDistrict).map((key) => {
      return (
        <View style={styles.cityDistrictSwitchContainer} key={key}>
          <Text style={styles.textLabel}>{Cities.brno.districts[key]}</Text>
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

  return (
    <View>
      <View style={styles.advertTypePickerContainer}>
        <Text style={styles.textLabel}>
          Filter ad type
        </Text>
        <Text style={styles.textLabel}></Text>
        <Picker
          selectedValue={filters.advertType}
          onValueChange={onAdvertTypeChange}
          style={styles.picker}
        >
          <Picker.Item label="Sale" value="sale" />
          <Picker.Item label="Rent" value="rent" />
        </Picker>
      </View>

      <View style={styles.sliderLabelContainer}>
        <Text style={styles.textLabel}>
          Minimum price
        </Text>
        <Text style={styles.textLabel}>
          {minPrice !== 0 ? minPrice.toString() + ' Kč' : ''}
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
          {maxPrice !== 0 ? maxPrice.toString() + ' Kč' : ''}
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
      <View style={styles.dispositionContainer}>
        { renderDispositionFilter() }
      </View>
      <View style={styles.cityDistrictContainer}>
        { renderCityDistrictFilter() }
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  advertTypePickerContainer: {
    flex: 1,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    marginTop: Layout.sideMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  text: {
    color: Colors.text,
  },
  picker: {
    height: 24,
    width: 100,
    color: Colors.text
  },
});
