import React, { useState, useContext, useMemo } from "react";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Alert } from "react-native";
import { observer } from "mobx-react";
import { UserServiceContext } from "../../../services/user";
import { FeedStorageContext } from "../../../services/feed";

import {
  RecordUserWrapper, RightItem, RightText, NavigationBar, LeftItem, CenterItem, NavigationText, ReportContentWrapper,
  ReportHeader, ReportContent, ReportFooter, ReportTitle, ReportBody
} from "../styled";
import { BasicButton, BasicButtonText, COLORS } from "../../../components/styled";

interface IProps {
  id: string;
  closeHandler: () => void;
}

export const ReportRecordingComponent = observer(({ id, closeHandler }: IProps) => {
  const [reportTitle, setReportTitle] = useState("");
  const [reportBody, setReportBody] = useState("");
  
  const { profile } = useContext(UserServiceContext);
  const { sendReport } = useContext(FeedStorageContext);
  const onChangeTitle = (text: string) => {
    setReportTitle(text);
  }

  const onChangeBody = (text: string) => {
    setReportBody(text);
  }

  const onSubmit = () => {
    sendReport(
      id,
      profile?.email,
      reportTitle,
      reportBody
    );
    closeHandler();
    Alert.alert("Email sent successfully!");
  }

  const isSubmitDisabled = useMemo(() => {
    return !reportTitle || !reportBody;
  }, [reportTitle, reportBody]);

  return (
    <RecordUserWrapper>
      <NavigationBar>
        <LeftItem />
        <CenterItem>
          <NavigationText>Report</NavigationText>
        </CenterItem>
        <RightItem>
          <RightText onPress={closeHandler}>Cancel</RightText>
        </RightItem>
      </NavigationBar>
      <KeyboardAwareScrollView>
        <ReportContentWrapper>
          <ReportHeader>
            <NavigationText
              style={{ color: COLORS.GREY, marginLeft: 40, marginRight: 40, marginTop: 20, marginBottom: 10 }}
            >
              If you find recording and comments that violate our contract with Bandwith, please send them to admin.
            </NavigationText>
            <NavigationText
              style={{ color: COLORS.GREY, marginLeft: 40, marginRight: 40, marginTop: 0, marginBottom: 20 }}
            >
              Then admin will check this and block that recording, comments and author.
            </NavigationText>
            <ReportTitle
              value={reportTitle}
              onChangeText={text => onChangeTitle(text)}
              underlineColorAndroid="transparent"
              placeholder={"Report Title"}
              placeholderTextColor={"grey"}
              numberOfLines={50}
              multiline={false}
              enablesReturnKeyAutomatically={true}
              keyboardType={"default"}
            />
          </ReportHeader>
          <ReportContent>
            <ReportBody
              value={reportBody}
              onChangeText={text => onChangeBody(text)}
              underlineColorAndroid="transparent"
              placeholder={"Report Body"}
              placeholderTextColor={"grey"}
              numberOfLines={50}
              multiline={true}
              enablesReturnKeyAutomatically={true}
              keyboardType={"default"}
            />
          </ReportContent>
          <ReportFooter>
            <BasicButton
              disabled={isSubmitDisabled}
              onPress={onSubmit}
              width="80%"
            >
              <BasicButtonText>Send</BasicButtonText>
            </BasicButton>
          </ReportFooter>
        </ReportContentWrapper>
      </KeyboardAwareScrollView>
    </RecordUserWrapper>
  );
});