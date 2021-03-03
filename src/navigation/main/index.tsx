import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {HomeScreen} from "../../screens/home";
import {NotificationsScreen} from "../../screens/notifications";

const Tab = createBottomTabNavigator();

export const MainNavigation = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Notification" component={NotificationsScreen} />
  </Tab.Navigator>
);


