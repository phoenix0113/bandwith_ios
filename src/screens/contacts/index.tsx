import React, { useState, useContext, useCallback } from "react";
import { observer } from "mobx-react";
import { View, TouchableOpacity, Animated } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TabView } from "react-native-tab-view";

import { showUnexpectedErrorAlert } from "../../utils/notifications";

import {
 CenterItem, LeftItem, NavigationBar, RightItem, NavigationText, BasicSafeAreaView,
} from "../../components/styled";
import { ContactAccountComponent } from "./ContactAccount";
import { ContactListComponent } from "./ContactList";

import { tabBarStyles } from "./styled";

import { OutgoingCallServiceInstance } from "../../services/outgoingCall";
import { ContactsServiceContext, ContactItemWithStatus } from "../../services/contacts";
import { SocketServiceContext, SocketServiceInstance } from "../../services/socket";
import { UserServiceContext, UserServiceInstance } from "../../services/user";

export const ContactListScreen = observer(() => {
  const { contacts } = useContext(ContactsServiceContext);

  const { profile } = useContext(UserServiceContext);

  const { removeContactAndNotify } = useContext(SocketServiceContext);

  useFocusEffect(
    useCallback(() => {
      if (UserServiceInstance.profile && SocketServiceInstance.socket) {
        SocketServiceInstance.refetchContacts();
      }
    }, [])
  );

  const [contactViewer, setContactViewer] = useState<ContactItemWithStatus>(null);

  const closeViewer = () => {
    setContactViewer(null);
  };

  const handleContactClick = (contact: ContactItemWithStatus) => {
    setContactViewer(contact);
  };

  const deleteContact = async (_id: string) => {
    try {
      if (await removeContactAndNotify(_id)) {
        closeViewer();
      }
    } catch (err) {
      showUnexpectedErrorAlert("screen.deleteContact()", err.message);
    }
  };

  const callContact = (_id: string) => {
    OutgoingCallServiceInstance.makeCall(_id);
    closeViewer();
  };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "inapp", title: "In-app contacts" },
    { key: "imported", title: "Imported contacts" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "inapp":
        return <ContactListComponent contacts={contacts} handleContactClick={handleContactClick} type="in-app" />;
      case "imported":
        return <ContactListComponent contacts={profile.contacts} handleContactClick={handleContactClick} type="imported"/>;
      default:
        return null;
    }
  };


  if (contactViewer) {
    return (
      <ContactAccountComponent
        _id={contactViewer._id}
        imageUrl={contactViewer.imageUrl}
        name={contactViewer.name}
        status={contactViewer.status}
        deleteHandler={deleteContact}
        callHandler={callContact}
        closeHandler={closeViewer}
      />
    );
  }

  return (
    <BasicSafeAreaView>
      <NavigationBar>
        <LeftItem />
        <CenterItem>
          <NavigationText>My Contacts</NavigationText>
        </CenterItem>
        <RightItem />
      </NavigationBar>

      <TabView
        renderTabBar={(props) => {
          const inputRange = props.navigationState.routes.map((x, i) => i);

          return (
            <View style={tabBarStyles.tabBar}>
              {props.navigationState.routes.map((route, i) => {
                const opacity = props.position.interpolate({
                  inputRange,
                  outputRange: inputRange.map((inputIndex) =>
                    inputIndex === i ? 1 : 0.5
                  ),
                });

                return (
                  <TouchableOpacity
                    key={i}
                    style={tabBarStyles.tabItem}
                    onPress={() => setIndex(i)}>
                      <Animated.Text style={{ opacity, ...tabBarStyles.tabText }}>{route.title}</Animated.Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        }}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />

    </BasicSafeAreaView>
  );
});
