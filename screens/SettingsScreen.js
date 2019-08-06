import API from '../constants/Api';
import Cities from '../constants/Cities';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import React from 'react';
import {
  AsyncStorage,
  Picker,
  Platform,
  ScrollView,
  Slider,
  StyleSheet,
  Switch,
  Text,
  ToastAndroid,
  View
} from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      settingsDisabled: true,
      minPriceForLabel: {
        [Cities.brno.code]: 0,
      },
      maxPriceForLabel: {
        [Cities.brno.code]: 0,
      },
      settings: {
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
      },
    };

    AsyncStorage.getItem('@Setttings:main')
    .then((settings) => {
      if (settings !== null) {
        const parsedSettings = this.getSettings(JSON.parse(settings));
        this.setState({
          settingsDisabled: false,
          minPriceForLabel: {[Cities.brno.code]: parsedSettings[Cities.brno.code].minPrice},
          maxPriceForLabel: {[Cities.brno.code]: parsedSettings[Cities.brno.code].maxPrice},
          settings: parsedSettings,
        });
      } else {
        this.setState({settingsDisabled: false});
      }
    });
  }

  render() {
    const settings = this.state.settings;
    const settingsEnabled = !this.state.settingsDisabled;
    const notificationsEnabled = settingsEnabled && settings.notificationsEnabled;
    const brnoSettings = this.state.settings[Cities.brno.code];
    const brnoSettingsEnabled = notificationsEnabled && brnoSettings.enabled;
    const minPriceForLabel = this.state.minPriceForLabel;
    const maxPriceForLabel = this.state.maxPriceForLabel;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.advertTypePickerContainer}>
          <Text style={settingsEnabled ? styles.textLabel : styles.textLabelDisabled}>
            Advert type
          </Text>
          <Text style={styles.textLabel}></Text>
          <Picker
            disabled={!settingsEnabled}
            selectedValue={settings.advertType}
            onValueChange={this.onAdvertTypeChange}
            style={styles.picker}
          >
            <Picker.Item label="Sale" value="sale" />
            <Picker.Item label="Rent" value="rent" />
          </Picker>
        </View>

        <View style={styles.separator}/>

        <View style={styles.notificationSwitchContainer}>
          <Text style={settingsEnabled ? styles.textLabel : styles.textLabelDisabled}>
            Enable notifications
          </Text>
          <Text style={styles.textLabel}></Text>
          <Switch
            disabled={!settingsEnabled}
            value={settings.notificationsEnabled}
            onValueChange={this.onNotificationsEnabledChange}
          />
        </View>

        <View style={styles.separator}/>

        <View style={styles.citySwitchContainer}>
          <Text style={notificationsEnabled ? styles.textLabel : styles.textLabelDisabled}>
            Brno
          </Text>
          <Switch
            disabled={!notificationsEnabled}
            value={settings[Cities.brno.code].enabled}
            onValueChange={(value) => this.onCityEnabledChange(Cities.brno.code, value)}
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
            maximumValue={this.state.settings.advertType === 'sale' ? 5000000 : 50000}
            step={this.state.settings.advertType === 'sale' ? 100000 : 1000}
            value={minPriceForLabel[Cities.brno.code]}
            onValueChange={(value) => this.onMinPriceChange(Cities.brno.code, value)}
            onSlidingComplete={(value) => this.onMinPriceChangeComplete(Cities.brno.code, value)}
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
            disabled={!brnoSettingsEnabled || !settingsEnabled}
            minimumValue={0}
            maximumValue={this.state.settings.advertType === 'sale' ? 5000000 : 50000}
            step={this.state.settings.advertType === 'sale' ? 100000 : 1000}
            value={maxPriceForLabel[Cities.brno.code]}
            onValueChange={(value) => this.onMaxPriceChange(Cities.brno.code, value)}
            onSlidingComplete={(value) => this.onMaxPriceChangeComplete(Cities.brno.code, value)}
          />
          <View style={styles.dispositionContainer}>
            { this.renderDispositionSettings(Cities.brno.code) }
          </View>
          <View style={styles.cityDistrictContainer}>
            { this.renderCityDistrictSettings(Cities.brno.code) }
          </View>
        </View>
      </ScrollView>
    );
  }

  renderDispositionSettings = (cityCode) => {
    const { disposition } = this.state.settings[cityCode];
    const enabled = !this.state.settingsDisabled && this.state.settings.notificationsEnabled && this.state.settings[cityCode].enabled;

    return Object.keys(disposition).map((key) => {
      return (
        <View style={styles.dispositionSwitchContainer} key={key}>
          <Text style={enabled ? styles.textLabel : styles.textLabelDisabled}>{key}</Text>
          <Switch
            disabled={!enabled}
            value={disposition[key]}
            onValueChange={(value) => {this.onDispositionEnabledChange(cityCode, key, value)}}
          />
        </View>
      );
    });
  }

  renderCityDistrictSettings = (cityCode) => {
    const { cityDistrict } = this.state.settings[cityCode];
    const enabled = !this.state.settingsDisabled && this.state.settings.notificationsEnabled && this.state.settings[cityCode].enabled;

    return Object.keys(cityDistrict).map((key) => {
      return (
        <View style={styles.cityDistrictSwitchContainer} key={key}>
          <Text style={enabled ? styles.textLabel : styles.textLabelDisabled}>{Cities.brno.districts[key]}</Text>
          <Switch
            disabled={!enabled}
            value={cityDistrict[key]}
            onValueChange={(value) => {this.onCityDistrictEnabledChange(cityCode, key, value)}}
          />
        </View>
      );
    });
  }

  onNotificationsEnabledChange = (value) => {
    this.persistSettings({notificationsEnabled: value});
  }

  onAdvertTypeChange = (value) => {
    this.persistSettings({advertType: value});
  }

  onCityEnabledChange = (cityCode, value) => {
    const settings = JSON.parse(JSON.stringify(this.getSettings()));
    settings[cityCode].enabled = value;
    this.persistSettings(settings);
  }

  onMinPriceChange = (cityCode, value) => {
    const minPriceForLabelSettings = JSON.parse(JSON.stringify(this.state.minPriceForLabel));
    minPriceForLabelSettings[cityCode] = value;
    this.setState({minPriceForLabel: minPriceForLabelSettings});
  }

  onMinPriceChangeComplete = (cityCode, value) => {
    clearTimeout(this.minPriceSliderTimeoutId)
    this.minPriceSliderTimeoutId = setTimeout(() => {
      const settings = JSON.parse(JSON.stringify(this.getSettings()));
      settings[cityCode].minPrice = value;
      this.persistSettings(settings);
    }, 50)
  }

  onMaxPriceChange = (cityCode, value) => {
    const maxPriceForLabelSettings = JSON.parse(JSON.stringify(this.state.maxPriceForLabel));
    maxPriceForLabelSettings[cityCode] = value;
    this.setState({maxPriceForLabel: maxPriceForLabelSettings});
  }

  onMaxPriceChangeComplete = (cityCode, value) => {
    clearTimeout(this.maxPriceSliderTimeoutId)
    this.maxPriceSliderTimeoutId = setTimeout(() => {
      const settings = JSON.parse(JSON.stringify(this.getSettings()));
      settings[cityCode].maxPrice = value;
      this.persistSettings(settings);
    }, 50)
  }

  onDispositionEnabledChange = (cityCode, disposition, value) => {
    const settings = JSON.parse(JSON.stringify(this.getSettings()));
    settings[cityCode].disposition[disposition] = value;
    this.persistSettings(settings);
  }

  onCityDistrictEnabledChange = (cityCode, cityDistrict, value) => {
    const settings = JSON.parse(JSON.stringify(this.getSettings()));
    settings[cityCode].cityDistrict[cityDistrict] = value;
    this.persistSettings(settings);
  }

  getSettings = (newSettings) => {
    let settings = this.state.settings;
    if (newSettings !== undefined) {
      settings = {...this.state.settings, ...newSettings};
    }
    return settings;
  }

  persistSettings = async (newSettings) => {
    const brnoFilters = {};
    const settings = this.getSettings(newSettings);
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

    return fetch(API.host+'/api/push-notification-token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: this.props.screenProps.expoToken,
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
        this.setState({settings: settings});
      });
    })
    .catch(() => {
      const minPriceForLabelSettings = JSON.parse(JSON.stringify(this.state.minPriceForLabel));
      const maxPriceForLabelSettings = JSON.parse(JSON.stringify(this.state.maxPriceForLabel));
      minPriceForLabelSettings[Cities.brno.code] = this.state.settings[Cities.brno.code].minPrice;
      maxPriceForLabelSettings[Cities.brno.code] = this.state.settings[Cities.brno.code].maxPrice;
      this.setState({
        minPriceForLabel: minPriceForLabelSettings,
        maxPriceForLabel: maxPriceForLabelSettings,
      }, () => {
        if (Platform.OS === 'android') {
          ToastAndroid.showWithGravity('Could not save settings, no connection.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
        }
      });
    });
  }
}

const styles = StyleSheet.create({
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
    borderWidth: 0.3,
    borderColor: Colors.text,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    marginTop: Math.round(Layout.sideMargin / 2),
    marginBottom: Math.round(Layout.sideMargin / 2),
  },
});
