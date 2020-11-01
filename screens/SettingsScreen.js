import React, { useContext, useEffect } from 'react';
import {
  AsyncStorage,
  Picker,
  Platform,
  SafeAreaView,
  ScrollView,
  Slider,
  StyleSheet,
  Switch,
  Text,
  ToastAndroid,
  View
} from 'react-native';

import API from '../constants/Api';
import Cities from '../constants/Cities';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import ExpoTokenContext from '../contexts/ExpoTokenContext'

export default function SettingsScreen() {
  const [settingsDisabled, setSettingsDisabled] = React.useState(true);
  const [minPriceForLabel, setMinPriceForLabel] = React.useState({
    [Cities.brno.code]: 0,
  });
  const [maxPriceForLabel, setMaxPriceForLabel] = React.useState({
    [Cities.brno.code]: 0,
  });
  const [settings, setSettings] = React.useState({
    advertType: 'sale',
    notificationsEnabled: false,
    [Cities.brno.code]: {
      enabled: false,
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
      cityDistrict: Cities.brno.districtsettings,
    },
  });
  const expoToken = useContext(ExpoTokenContext);
  const notificationsEnabled = !settingsDisabled && settings.notificationsEnabled;
  const brnoSettings = settings[Cities.brno.code];
  const brnoSettingsEnabled = notificationsEnabled && brnoSettings.enabled;

  const renderDispositionSettings = (cityCode) => {
    const { disposition } = settings[cityCode];
    const enabled = !settingsDisabled && settings.notificationsEnabled && settings[cityCode].enabled;

    return Object.keys(disposition).map((key) => {
      return (
        <View style={styles.dispositionSwitchContainer} key={key}>
          <Text style={enabled ? styles.textLabel : styles.textLabelDisabled}>{key}</Text>
          <Switch
            disabled={!enabled}
            value={disposition[key]}
            onValueChange={(value) => {onDispositionEnabledChange(cityCode, key, value)}}
            trackColor={{false: Colors.buttonOff, true: Colors.buttonLight}}
            thumbColor={disposition[key] ? Colors.button : Colors.buttonOffLight}
          />
        </View>
      );
    });
  };

  const renderCityDistrictSettings = (cityCode) => {
    const { cityDistrict } = settings[cityCode];
    const enabled = !settingsDisabled && settings.notificationsEnabled && settings[cityCode].enabled;

    return Object.keys(cityDistrict).map((key) => {
      return (
        <View style={styles.cityDistrictSwitchContainer} key={key}>
          <Text style={enabled ? styles.textLabel : styles.textLabelDisabled}>{Cities.brno.districts[key]}</Text>
          <Switch
            disabled={!enabled}
            value={cityDistrict[key]}
            onValueChange={(value) => {onCityDistrictEnabledChange(cityCode, key, value)}}
            trackColor={{false: Colors.buttonOff, true: Colors.buttonLight}}
            thumbColor={cityDistrict[key] ? Colors.button : Colors.buttonOffLight}
          />
        </View>
      );
    });
  };

  const onNotificationsEnabledChange = (value) => {
    persistSettings({notificationsEnabled: value});
  };

  const onAdvertTypeChange = (value) => {
    persistSettings({advertType: value});
  };

  const onCityEnabledChange = (cityCode, value) => {
    const s = JSON.parse(JSON.stringify(settings));
    s[cityCode].enabled = value;
    persistSettings(s);
  };

  const onMinPriceChange = (cityCode, value) => {
    const minPriceForLabelSettings = JSON.parse(JSON.stringify(minPriceForLabel));
    minPriceForLabelSettings[cityCode] = value;
    setMinPriceForLabel(minPriceForLabelSettings);
  };

  const onMinPriceChangeComplete = (cityCode, value) => {
    clearTimeout(minPriceSliderTimeoutId)
    const minPriceSliderTimeoutId = setTimeout(() => {
      const s = JSON.parse(JSON.stringify(settings));
      s[cityCode].minPrice = value;
      persistSettings(s);
    }, 50)
  };

  const onMaxPriceChange = (cityCode, value) => {
    const maxPriceForLabelSettings = JSON.parse(JSON.stringify(maxPriceForLabel));
    maxPriceForLabelSettings[cityCode] = value;
    setMaxPriceForLabel(maxPriceForLabelSettings);
  };

  const onMaxPriceChangeComplete = (cityCode, value) => {
    clearTimeout(maxPriceSliderTimeoutId)
    const maxPriceSliderTimeoutId = setTimeout(() => {
      const s= JSON.parse(JSON.stringify(settings));
      s[cityCode].maxPrice = value;
      persistSettings(s);
    }, 50)
  }

  const onDispositionEnabledChange = (cityCode, disposition, value) => {
    const s = JSON.parse(JSON.stringify(settings));
    s[cityCode].disposition[disposition] = value;
    persistSettings(s);
  };

  const onCityDistrictEnabledChange = (cityCode, cityDistrict, value) => {
    const s = JSON.parse(JSON.stringify(settings));
    s[cityCode].cityDistrict[cityDistrict] = value;
    persistSettings(s);
  };

  const mergeSettings = (newSettings) => {
    return {...settings, ...newSettings};
  };

  const persistSettings = async (newSettings) => {
    const brnoFilters = {};
    const settings = mergeSettings(newSettings);
    const brnoSettings = settings[Cities.brno.code];
    let filters = {};

    if (brnoSettings.enabled) {
      if (brnoSettings.minPrice !== 0) {
        if (brnoFilters.price === undefined) {
          brnoFilters.price = {};
        }
        brnoFilters.price.gte = brnoSettings.minPrice;
      }
      if (brnoSettings.maxPrice !== 0) {
        if (brnoFilters.price === undefined) {
          brnoFilters.price = {};
        }
        brnoFilters.price.lte = brnoSettings.maxPrice;
      }
      brnoFilters.disposition = Object.keys(brnoSettings.disposition).filter((key) => {
        return brnoSettings.disposition[key];
      }).map((key) => {
        return key;
      });
      brnoFilters.cityDistrict = Object.keys(brnoSettings.cityDistrict).filter((key) => {
        return brnoSettings.cityDistrict[key];
      }).map((key) => {
        return key;
      });
      brnoFilters.advertType = settings.advertType;
      filters[Cities.brno.code] = brnoFilters;
    }

    return fetch(API.host+'/api/push_notification_tokens', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: expoToken,
        enabled: settings.notificationsEnabled,
        filters: filters,
      }),
    })
    .then((response) => {
      if (response.ok === false) {
        throw new Error(response.statusText);
      }
      return AsyncStorage.setItem(
        '@Setttings:main',
        JSON.stringify(settings)
      ).
      then(() => {
        setSettings(settings);
      });
    })
    .catch(() => {
      const minPriceForLabelSettings = JSON.parse(JSON.stringify(minPriceForLabel));
      const maxPriceForLabelSettings = JSON.parse(JSON.stringify(maxPriceForLabel));
      minPriceForLabelSettings[Cities.brno.code] = s[Cities.brno.code].minPrice;
      maxPriceForLabelSettings[Cities.brno.code] = s[Cities.brno.code].maxPrice;
      setMinPriceForLabel(minPriceForLabelSettings);
      setMaxPriceForLabel(maxPriceForLabelSettings);
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity('Could not save settings, no connection.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
    });
  };

  useEffect(() => {
    AsyncStorage.getItem('@Setttings:main')
    .then((item) => {
      if (item !== null) {
        const parsedSettings = mergeSettings(JSON.parse(item));
        setSettingsDisabled(false);
        setMinPriceForLabel({[Cities.brno.code]: parsedSettings[Cities.brno.code].minPrice});
        setMaxPriceForLabel({[Cities.brno.code]: parsedSettings[Cities.brno.code].maxPrice});
        setSettings(parsedSettings);
      } else {
        setSettingsDisabled(false);
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView style={styles.container}>
        <View style={styles.advertTypePickerContainer}>
          <Text style={!settingsDisabled ? styles.textLabel : styles.textLabelDisabled}>
            Advert type
          </Text>
          <Text style={styles.textLabel}></Text>
          <Picker
            disabled={settingsDisabled}
            selectedValue={settings.advertType}
            onValueChange={onAdvertTypeChange}
            style={styles.picker}
          >
            <Picker.Item label="Sale" value="sale" />
            <Picker.Item label="Rent" value="rent" />
          </Picker>
        </View>

        <View style={styles.separator}/>

        <View style={styles.notificationSwitchContainer}>
          <Text style={!settingsDisabled ? styles.textLabel : styles.textLabelDisabled}>
            Enable notifications
          </Text>
          <Text style={styles.textLabel}></Text>
          <Switch
            disabled={settingsDisabled}
            value={settings.notificationsEnabled}
            onValueChange={onNotificationsEnabledChange}
            trackColor={{false: Colors.buttonOff, true: Colors.buttonLight}}
            thumbColor={settings.notificationsEnabled ? Colors.button : Colors.buttonOffLight}
          />
        </View>

        <View style={notificationsEnabled ? styles.separator : {height: 0}}/>

        <View style={notificationsEnabled ? styles.citySwitchContainer : {height: 0}}>
          <Text style={styles.textLabel}>Brno</Text>
          <Switch
            disabled={!notificationsEnabled}
            value={settings[Cities.brno.code].enabled}
            onValueChange={(value) => onCityEnabledChange(Cities.brno.code, value)}
            trackColor={{false: Colors.buttonOff, true: Colors.buttonLight}}
            thumbColor={settings[Cities.brno.code].enabled ? Colors.button : Colors.buttonOffLight}
          />
        </View>
        <View style={brnoSettingsEnabled ? {marginTop: Math.round(Layout.sideMargin / 2)} : {height: 0}}>
          <View style={styles.sliderLabelContainer}>
            <Text style={brnoSettingsEnabled ? styles.textLabel : styles.textLabelDisabled}>
              Minimum price
            </Text>
            <Text style={brnoSettingsEnabled ? styles.textLabel : styles.textLabelDisabled}>
              {minPriceForLabel[Cities.brno.code] !== 0 ? minPriceForLabel[Cities.brno.code].toString() + ' Kč' : ''}
            </Text>
          </View>
          <Slider
            style={styles.slider}
            disabled={!brnoSettingsEnabled}
            minimumValue={0}
            maximumValue={settings.advertType === 'sale' ? 5000000 : 50000}
            step={settings.advertType === 'sale' ? 100000 : 1000}
            value={minPriceForLabel[Cities.brno.code]}
            onValueChange={(value) => onMinPriceChange(Cities.brno.code, value)}
            onSlidingComplete={(value) => onMinPriceChangeComplete(Cities.brno.code, value)}
            thumbTintColor={Colors.button}
            minimumTrackTintColor={Colors.buttonLight}
            maximumTrackTintColor={Colors.buttonOff}
          />
          <View style={styles.sliderLabelContainer}>
            <Text style={brnoSettingsEnabled ? styles.textLabel : styles.textLabelDisabled}>
              Maximum price
            </Text>
            <Text style={brnoSettingsEnabled ? styles.textLabel : styles.textLabelDisabled}>
              {maxPriceForLabel[Cities.brno.code] !== 0 ? maxPriceForLabel[Cities.brno.code].toString() + ' Kč' : ''}
            </Text>
          </View>
          <Slider
            style={styles.slider}
            disabled={!brnoSettingsEnabled || settingsDisabled}
            minimumValue={0}
            maximumValue={settings.advertType === 'sale' ? 5000000 : 50000}
            step={settings.advertType === 'sale' ? 100000 : 1000}
            value={maxPriceForLabel[Cities.brno.code]}
            onValueChange={(value) => onMaxPriceChange(Cities.brno.code, value)}
            onSlidingComplete={(value) => onMaxPriceChangeComplete(Cities.brno.code, value)}
            thumbTintColor={Colors.button}
            minimumTrackTintColor={Colors.buttonLight}
            maximumTrackTintColor={Colors.buttonOff}
          />
          <View style={styles.dispositionContainer}>
            { renderDispositionSettings(Cities.brno.code) }
          </View>
          <View style={styles.cityDistrictContainer}>
            { renderCityDistrictSettings(Cities.brno.code) }
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    marginTop: Layout.mainStatusBarHeight,
    paddingTop: Math.round(Layout.sideMargin / 2),
    backgroundColor: Colors.background,
  },
  advertTypePickerContainer: {
    flex: 1,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationSwitchContainer: {
    flex: 1,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  citySwitchContainer: {
    flex: 1,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabelContainer: {
    flex: 1,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
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
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  cityDistrictSwitchContainer: {
    width: Math.round((Layout.width - (2 * Layout.sideMargin)) / 2) - Layout.sideMargin,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textLabel: {
    fontSize: Layout.labelFontSize,
    color: Colors.text,
  },
  textLabelDisabled: {
    fontSize: Layout.labelFontSize,
    color: Colors.disabledText,
  },
  text: {
    color: Colors.text,
  },
  picker: {
    height: 24,
    width: 100,
    color: Colors.text
  },
  separator: {
    borderWidth: 0.2,
    borderColor: Colors.text,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    marginTop: Math.round(Layout.sideMargin / 2),
    marginBottom: Math.round(Layout.sideMargin / 2),
  },
});
