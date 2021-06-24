import React, { useState, useContext, useMemo } from "react";

import { observer } from "mobx-react";
import { FeedStorageContext } from "../../../services/feed";

import {
  RecordUserWrapper, RightItem, RightText, NavigationBar, LeftItem, CenterItem, NavigationText, ReportContentWrapper,
  ReportHeader, ReportContent, ReportFooter, ReportTitle, ReportBody
} from "../styled";
import { BasicButton, BasicButtonText } from "../../../components/styled";

interface IProps {
  id: string;
  closeHandler: () => void;
}

export const ReportRecordingComponent = observer(({ id, closeHandler }: IProps) => {
  const [reportTitle, setReportTitle] = useState("");
  const [reportBody, setReportBody] = useState("");
  
  const { sendReport } = useContext(FeedStorageContext);
  const onChangeTitle = (text: string) => {
    setReportTitle(text);
  }

  const onChangeBody = (text: string) => {
    setReportBody(text);
  }

  const onSubmit = () => {
    sendReport(id);
    closeHandler();
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
      <ReportContentWrapper>
        <ReportHeader>
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
    </RecordUserWrapper>
  );
});