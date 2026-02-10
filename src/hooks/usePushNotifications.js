import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import api from '../services/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const usePushNotifications = (onNotificationResponse) => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        // alert('Failed to get push token for push notification!');
        console.log('Failed to get push token for push notification!');
        return;
      }
      
      try {
          // Get the token
          token = (await Notifications.getExpoPushTokenAsync({
            projectId: 'a4bc6fda-94fe-44be-8588-b887978b89ad'
          })).data;
          console.log("EXPO PUSH TOKEN:", token);
      } catch (e) {
          console.error("Error getting push token:", e);
      }
      
    } else {
      // alert('Must use physical device for Push Notifications');
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  }



  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
        setExpoPushToken(token);
        if(token) {
            // We encourage calling this manually after login, but if we have a token 
            // and maybe a stored session, we could try. 
            // Better to expose this function and call it from AuthContext.
        }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notification Tapped:", response);
      if (onNotificationResponse) {
        onNotificationResponse(response);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return {
    expoPushToken,
    notification,
    registerForPushNotificationsAsync
  };
};
