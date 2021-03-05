import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { HomeScreen } from "../../screens/home";
import { FeedScreen } from "../../screens/feed";
import { NotificationsScreen } from "../../screens/notifications";
import { ContactListScreen } from "../../screens/contacts";

import HomeIcon from "../../assets/images/navigation/home.svg";
import FeedIcon from "../../assets/images/navigation/feed.svg";
import NotificationsIcon from "../../assets/images/navigation/notification.svg";
import ContactListIcon from "../../assets/images/navigation/contacts.svg";

import { COLORS } from "../../components/styled";
import { MainBottomTabsParamList } from "./types";

const Tab = createBottomTabNavigator<MainBottomTabsParamList>();

export const MainNavigation = () => (
  <Tab.Navigator
    backBehavior={"none"}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        switch (route.name) {
          case "Home":
            return <HomeIcon fill={focused ? COLORS.WHITE : COLORS.GREY} />;
          case "Feed":
            return <FeedIcon fill={focused ? COLORS.WHITE : COLORS.GREY} />;
          case "Notifications":
            return <NotificationsIcon fill={focused ? COLORS.WHITE : COLORS.GREY} />;
          case "ContactList":
            return <ContactListIcon fill={focused ? COLORS.WHITE : COLORS.GREY} />;
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
    <Tab.Screen name="Notifications" component={NotificationsScreen} />
    <Tab.Screen name="ContactList" component={ContactListScreen} />
  </Tab.Navigator>
);


