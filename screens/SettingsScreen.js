import API from '../constants/Api';
import Colors from '../constants/Colors';
import React from 'react';
import { AsyncStorage, Platform, ScrollView, Slider, StyleSheet, Switch, Text, ToastAndroid, View } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  constructor(props) {
    super(props);

    this.state = {
      settingsDisabled: true,
      minPriceForLabel: 0,
      maxPriceForLabel: 0,
      settings: {
        notificationsEnabled: false,
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
        }
      },
    }

    AsyncStorage.getItem('@Notifications:'+this.props.screenProps.expoToken)
    .then((settings) => {
      if (settings !== null) {
        const parsedSettings = this.getSettings(JSON.parse(settings));
        this.setState({
          settingsDisabled: false,
          minPriceForLabel: parsedSettings.minPrice,
          maxPriceForLabel: parsedSettings.maxPrice,
          settings: parsedSettings,
        });
      } else {
        this.setState({settingsDisabled: false});
      }
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.settingsContainer}>
          <View style={styles.notificationSwitchContainer}>
            <Text style={styles.textLabel}>Enable notifications</Text>
            <Switch
              disabled={this.state.settingsDisabled}
              value={this.state.settings.notificationsEnabled}
              onValueChange={this.onNotificationsEnabledChange}
            />
          </View>

          <View style={styles.separator}/>

          <View style={[styles.sliderLabelContainer, styles.mt10]}>
            <Text style={this.state.settings.notificationsEnabled ? styles.textLabel : styles.textLabelDisabled}>
              Minimum price
            </Text>
            <Text style={this.state.settings.notificationsEnabled ? styles.textLabel : styles.textLabelDisabled}>
              {this.state.minPriceForLabel !== 0 ? this.state.minPriceForLabel.toString() + ' Kč' : ''}
            </Text>
          </View>
          <Slider
            style={styles.slider}
            disabled={!this.state.settings.notificationsEnabled || this.state.settingsDisabled}
            minimumValue={0}
            maximumValue={5000000}
            step={100000}
            value={this.state.minPriceForLabel}
            onValueChange={this.onMinPriceChange}
            onSlidingComplete={this.onMinPriceChangeComplete}
          />
          <View style={[styles.sliderLabelContainer, styles.mt10]}>
            <Text style={this.state.settings.notificationsEnabled ? styles.textLabel : styles.textLabelDisabled}>
              Maximum price
            </Text>
            <Text style={this.state.settings.notificationsEnabled ? styles.textLabel : styles.textLabelDisabled}>
              {this.state.maxPriceForLabel !== 0 ? this.state.maxPriceForLabel.toString() + ' Kč' : ''}
            </Text>
          </View>
          <Slider
            style={styles.slider}
            disabled={!this.state.settings.notificationsEnabled || this.state.settingsDisabled}
            minimumValue={0}
            maximumValue={5000000}
            step={100000}
            value={this.state.maxPriceForLabel}
            onValueChange={this.onMaxPriceChange}
            onSlidingComplete={this.onMaxPriceChangeComplete}
          />
          <View style={[styles.dispositionContainer, styles.mt20]}>
            <Text style={this.state.settings.notificationsEnabled ? styles.textLabel : styles.textLabelDisabled}>
              Disposition
            </Text>
          </View>
          <View style={styles.dispositionContainer}>
            { this.renderDispositionSettings() }
          </View>
        </View>
      </ScrollView>
    );
  }

  renderDispositionSettings = () => {
    const { disposition } = this.state.settings;

    return Object.keys(disposition).map((key) => {
      return (
        <View style={styles.dispositionSwitchContainer} key={key}>
          <Text style={this.state.settings.notificationsEnabled ? styles.textLabel : styles.textLabelDisabled}>{key}</Text>
          <Switch
            disabled={!this.state.settings.notificationsEnabled || this.state.settingsDisabled}
            value={disposition[key]}
            onValueChange={(value) => {this.onDispositionEnabledChange(key, value)}}
          />
        </View>
      );
    });
  }

  onNotificationsEnabledChange = (value) => {
    this.persistSettings({notificationsEnabled: value});
  }

  onMinPriceChange = (value) => {
    this.setState({minPriceForLabel: value});
  }

  onMinPriceChangeComplete = (value) => {
    clearTimeout(this.minPriceSliderTimeoutId)
    this.minPriceSliderTimeoutId = setTimeout(() => {
      this.persistSettings({minPrice: value});
    }, 50)
  }

  onMaxPriceChange = (value) => {
    this.setState({maxPriceForLabel: value});
  }

  onMaxPriceChangeComplete = (value) => {
    clearTimeout(this.maxPriceSliderTimeoutId)
    this.maxPriceSliderTimeoutId = setTimeout(() => {
      this.persistSettings({maxPrice: value});
    }, 50)
  }

  onDispositionEnabledChange = (disposition, value) => {
    const settings = JSON.parse(JSON.stringify(this.getSettings()));
    settings.disposition[disposition] = value;
    this.persistSettings(settings);
  }

  getSettings = (newSettings) => {
    let settings = this.state.settings;
    if (settings !== undefined) {
      settings = {...this.state.settings, ...newSettings};
    }
    return settings;
  }

  persistSettings = async (newSettings) => {
    const filter = {};
    const settings = this.getSettings(newSettings);

    if (settings.minPrice !== 0) {
      if (filter.price === undefined) {
        filter.price = {};
      }
      filter.price.gte = settings.minPrice;
    }
    if (settings.maxPrice !== 0) {
      if (filter.price === undefined) {
        filter.price = {};
      }
      filter.price.lte = settings.maxPrice;
    }
    filter.disposition = Object.keys(settings.disposition).filter((key) => {
      return settings.disposition[key];
    }).map((key) => {
      return key;
    });
    return fetch(API.host+'/api/push-notification-token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: this.props.screenProps.expoToken,
        enabled: settings.notificationsEnabled,
        filter: filter,
      }),
    })
    .then(() => {
      return AsyncStorage.setItem(
        '@Notifications:'+this.props.screenProps.expoToken,
        JSON.stringify(settings)
      ).
      then(() => {
        this.setState({settings: settings});
      });
    })
    .catch(() => {
      this.setState({
        minPriceForLabel: this.state.settings.minPrice,
        maxPriceForLabel: this.state.settings.maxPrice,
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
    paddingTop: 15,
    backgroundColor: Colors.background,
  },
  settingsContainer: {
  },
  notificationSwitchContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabelContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slider: {
    borderRadius: 150,
  },
  dispositionContainer: {
    flex: 1,
    width: 360,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  dispositionSwitchContainer: {
    width: 100,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textLabel: {
    fontSize: 18,
    color: Colors.text,
  },
  textLabelDisabled: {
    fontSize: 18,
    color: Colors.textDisabled,
  },
  text: {
    color: Colors.text,
  },
  separator: {
    borderWidth: 0.2,
    borderColor: Colors.text,
    marginLeft: 15,
    marginRight: 25,
    marginTop: 15,
    marginBottom: 15,
  },
  mt10: {
    marginTop: 10,
  },
  mt20: {
    marginTop: 20,
  },
});
