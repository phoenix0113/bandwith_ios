import React, { useContext, useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { observer } from "mobx-react";
import Icon from "react-native-vector-icons/FontAwesome";

import { NotificationServiceContext } from "../../services/notifications";

import { HomeScreen } from "../../screens/home";
import { NotificationsScreen } from "../../screens/notifications";
import { ProfileScreen } from "../../screens/profile";
import { ContactListScreen } from "../../screens/contacts";
import { FeedScreen } from "../../screens/feed";

import HomeIcon from "../../assets/images/navigation/home.svg";
import NotificationsIcon from "../../assets/images/navigation/notification.svg";
import ContactListIcon from "../../assets/images/navigation/contacts.svg";
import FeedIcon from "../../assets/images/navigation/feed.svg";

import { COLORS } from "../../components/styled";
import { MainBottomTabsParamList } from "./types";

const Tab = createBottomTabNavigator<MainBottomTabsParamList>();

export const MainNavigation = observer(() => {
  const { notifications } = useContext(NotificationServiceContext);

  const unreadCounter = useMemo(() => {
    let counter = 0;
    notifications.forEach((notification) => {
      if (!notification.read) {
        counter++;
      }
    });
    return counter;
  }, [notifications]);


  return (
    <Tab.Navigator
      backBehavior={"none"}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case "Home":
              return <HomeIcon fill={focused ? COLORS.WHITE : COLORS.GREY} />;
            case "Notifications":
              return <NotificationsIcon fill={focused ? COLORS.WHITE : COLORS.GREY} />;
            case "ContactList":
             return <ContactListIcon fill={focused ? COLORS.WHITE : COLORS.GREY} />;
            case "Profile":
              return <Icon name="user-circle-o" size={24} color={focused ? COLORS.WHITE : COLORS.GREY} />;
            case "Feed":
              return <FeedIcon fill={focused ? COLORS.WHITE : COLORS.GREY} />;
          }
        },
      })}
      tabBarOptions={{
        inactiveBackgroundColor: COLORS.BLACK,
        activeBackgroundColor: COLORS.BLACK,
        activeTintColor: COLORS.WHITE,
        inactiveTintColor: COLORS.WHITE,
        style: {
          backgroundColor: COLORS.BLACK,
          borderTopColor: "transparent",
        },
        showLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ tabBarBadge: unreadCounter || null }} />
      <Tab.Screen name="ContactList" component={ContactListScreen} />
    </Tab.Navigator>
  );
});


