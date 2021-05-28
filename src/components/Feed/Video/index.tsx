import React, { useState, useEffect } from "react";
import { FlatList, Dimensions, StyleSheet } from "react-native";
import Video from "react-native-video";

import { 
  FeedPageContentWrapper, ProfileContent, ProfilePhoto, ProfileText, ProfileName, ProfileLevel, AddFollowButton,
  PlayPauseButtonContent, PlayPauseButton, AddFollowText
} from "./styled";

import PlayIcon from "../../../assets/images/feed/play.svg";
import PauseIcon from "../../../assets/images/feed/pause.svg";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface IProps {
  videoData: { 
    id: string, 
    video: string, 
    photo: string, 
    name: string, 
    level:string }[],
    videoID: string,
}

const readyNumber:number = 2;

export const FeedVideo = ({ videoData, videoID }: IProps) => {
  const [allVideoData, setAllVideoData] = useState([]);
  const [currentVideoID, setCurrentVideoID] = useState("");
  const [videoIDs, setVideoIDs] = useState([]);
  const [readyVideoDATA, setReadyVideoDATA] = useState([]);

  // function for get video data from current id
  const getDataFromID = (ID:string) => {
    let count: number = 0;
    let index: number = 0;
    let id: string = "";
    let video: string = "";
    let photo: string = "";
    let name: string = "";
    let status: boolean = false;
    if(currentVideoID === ID)
      status = true;

    if(allVideoData.length !== 0) {
      allVideoData.map((data) => {
        count++;
        if(data.id === ID) {
          index = count;
          id = data.id;
          video = data.video;
          photo = data.photo;
          name = data.name;
        }
      })
    }

    return {
      index: index,
      id: id,
      video: video,
      photo: photo,
      name: name,
      status: status,
    }
  }

  //function for get ready video data from index
  const getReadyDataFromIndex = (index:number) => {
    let readyData = [];

    // push before video data
    let count = 0;
    let start = ((index-2-readyNumber) >= 0) ? index-2-readyNumber : 0;
    let end = (index-1 > 0) ? index-1 : 0;
    for(let i=start; i<end; i++) {
      let tempData = getDataFromID(videoIDs[i]);
      readyData.push(tempData);
    }

    // push current video data
    let video = getDataFromID(currentVideoID);
    readyData.push(video);

    // push after video data
    count = 0;
    end = ((index+readyNumber) > videoIDs.length) ? videoIDs.length : index+readyNumber;
    for(let i=index; i<end; i++) {
      if(count < readyNumber) {
        let tempData = getDataFromID(videoIDs[i]);
        count++;
        readyData.push(tempData);
      }
    }

    return readyData;
  }

  // function for play video
  const playVideo = () => {
    let updateReadyVideoDATA = readyVideoDATA;
    updateReadyVideoDATA[readyNumber].status = true;
    setReadyVideoDATA(updateReadyVideoDATA);
    console.log(readyVideoDATA);
  }

  // function for pause video
  const pauseVideo = () => {
    let updateReadyVideoDATA = readyVideoDATA;
    updateReadyVideoDATA[readyNumber].status = false;
    setReadyVideoDATA(updateReadyVideoDATA);
    console.log(readyVideoDATA);
  }

  useEffect(() => {
    let IDs = [];
    allVideoData.map((video) => {
      IDs.push(video.id);
    })
    setVideoIDs(IDs);
  }, [allVideoData]);

  useEffect(() => {
    let video = getDataFromID(currentVideoID);
    setReadyVideoDATA([])
    setReadyVideoDATA(getReadyDataFromIndex(video.index))
  }, [currentVideoID])

  useEffect(() => {
    setAllVideoData(videoData);
    setCurrentVideoID(videoID);
  }, [])

  const renderItem = ({item}) => (
    <FeedPageContentWrapper>
      <ProfileContent>
        <ProfilePhoto source={{uri: item.photo}} />
        <ProfileText>
          <ProfileName>{item.name}</ProfileName>
          <ProfileLevel>{item.level}</ProfileLevel>
        </ProfileText>
        <AddFollowButton>
          <AddFollowText>
            Follow
          </AddFollowText>
        </AddFollowButton>
      </ProfileContent>
      <PlayPauseButtonContent>
      {
        (item.status)? <PauseIcon onPress={pauseVideo} /> : <PlayIcon onPress={playVideo} />
      }
      </PlayPauseButtonContent>
      <Video
        source={{uri: item.video}}
        paused={!item.status}
        style={styles.backgroundVideo}
      />
    </FeedPageContentWrapper>
  );

  return (
    <FlatList
      data={readyVideoDATA}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

let styles = StyleSheet.create({
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: windowWidth,
    height: windowHeight,
    alignItems: "stretch",
    zIndex: 10,
  },
});
