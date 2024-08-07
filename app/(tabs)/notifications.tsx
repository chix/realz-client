import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  ToastAndroid,
  View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import API from '@/constants/Api';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import ExpoTokenContext from '@/contexts/ExpoTokenContext'
import NotificationFilters from '@/components/NotificationFilters';
import { Filters, FiltersPayload, Settings, SettingsPartial } from '@/types';

export default function NotificationsScreen() {
  const [settingsDisabled, setSettingsDisabled] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    notificationsEnabled: false,
    filters: [],
  });
  const expoToken = useContext(ExpoTokenContext);
  const notificationsEnabled = !settingsDisabled && settings.notificationsEnabled;

  const onNotificationsEnabledChange = (value: boolean) => {
    persistSettings({notificationsEnabled: value});
  };

  const addNotificationFilter = (filter?: Filters) => {
    const s = JSON.parse(JSON.stringify(settings));
    s.filters.push(filter);
    setSettings(mergeSettings(s));
  }

  const removeNotificationFilter = (key: number) => {
    const s = JSON.parse(JSON.stringify(settings));
    s.filters.splice(key, 1);
    persistSettings(s);
  }

  const onFiltersSubmit = async (key: number, filters: Filters) => {
    const s = JSON.parse(JSON.stringify(settings));
    s.filters[key] = filters;
    return persistSettings(s);
  }

  const mergeSettings = (newSettings: SettingsPartial) => {
    return {...settings, ...newSettings};
  };

  const persistSettings = async (newSettings: SettingsPartial) => {
    const settings = mergeSettings(newSettings)

    let filtersPayload: FiltersPayload[] = [];

    Object.values(settings.filters).forEach((filters) => {
      if (!filters) {
        return;
      }

      let payload: FiltersPayload = {
        advertType: filters.advertType,
        propertyType: filters.propertyType,
        propertySubtype: filters.propertySubtype[filters.propertyType]
          ? Object.keys(filters.propertySubtype[filters.propertyType]).filter((key) => {
            return filters.propertySubtype[filters.propertyType][key];
          }).map((key) => {
            return key;
          })
          : undefined,
        cityCode: filters.cityCode ?? undefined,
        cityDistrict: filters.cityDistrict
          ? Object.keys(filters.cityDistrict).filter((key) => {
            return filters.cityDistrict?.[key];
          }).map((key) => {
            return key;
          })
          : undefined,
        districtCode: filters.districtCode ?? undefined,
        disposition: Object.keys(filters.disposition).filter((key) => {
          return filters.disposition[key];
        }).map((key) => {
          return key;
        })
      };

      if (filters.minPrice !== 0) {
        if (payload.price === undefined) {
          payload.price = {};
        }
        payload.price.gte = filters.minPrice;
      }

      if (filters.maxPrice !== 0) {
        if (payload.price === undefined) {
          payload.price = {};
        }
        payload.price.lte = filters.maxPrice;
      }

      filtersPayload.push(payload);
    });

    return fetch(API.host+'/api/push_notification_tokens', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: expoToken,
        enabled: settings.notificationsEnabled,
        filters: filtersPayload,
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
      loadSettings();
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity('Could not save settings, no connection.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
      return Promise.reject();
    });
  };

  const loadSettings = () => {
    AsyncStorage.getItem('@Setttings:main')
    .then((item) => {
      if (item !== null) {
        const parsedSettings = JSON.parse(item);
        setSettings(mergeSettings(parsedSettings));
      }
      setSettingsDisabled(false);
    });
  }

  const renderFilters = () => {
    const { filters } = settings;

    return filters.map((filter, key) => {
      return (
        <View key={key} style={styles.filtersContainer}>
          <NotificationFilters filtersInput={filters[key]} filtersKey={key} submitFilters={onFiltersSubmit} />
          <View style={styles.buttonContainer}>
            <Button
              color={Colors.errorBackground}
              title={"Remove filter " + (key + 1)} onPress={() => removeNotificationFilter(key)}
            />
          </View>
        </View>
      );
    });
  };

  useEffect(() => loadSettings(), []);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView style={styles.container}>
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
        { notificationsEnabled ? renderFilters() : <></> }
        {
          notificationsEnabled ?
            <View style={styles.buttonContainer}>
              <Button
                color={Colors.button}
                title="Add filter" onPress={() => addNotificationFilter()}
              />
            </View>
            : <></>
        }
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
  filtersContainer: {
    borderWidth: 0.2,
    borderColor: Colors.text,
    margin: Layout.sideMargin,
  },
  notificationSwitchContainer: {
    flex: 1,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
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
  separator: {
    borderWidth: 0.2,
    borderColor: Colors.text,
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    marginTop: Math.round(Layout.sideMargin),
    marginBottom: Math.round(Layout.sideMargin),
  },
  buttonContainer: {
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    marginTop: Layout.sideMargin,
    marginBottom: Layout.sideMargin,
  },
});
