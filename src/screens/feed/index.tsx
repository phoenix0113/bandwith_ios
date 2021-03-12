import React, { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native";
import {
  MediaStream,
  mediaDevices,
} from "react-native-webrtc";
import { API_OPERATION } from "avcore";
import InCallManager from "react-native-incall-manager";

import { UserServiceContext } from "../../services/user";

import {CallVideo, CallWrapper} from "./styled";
import {
  COLORS, CenterItem, LeftItem, NavigationBar, PageWrapper,
  RightItem, NavigationText,
 } from "../../components/styled";


export const FeedScreen = () => {
  const [stream, setStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);

  const {avcoreCloudClient, cloud} = useContext(UserServiceContext);

  const createStream = async () => {
    /**
     * Incoming stream's tracks update logic test
     */
    const onAddTrack = (track) => {
      console.log("onAddTrack", track);
      remoteStream.addTrack(track.track);

      const tracks = remoteStream.getTracks();

      console.log("[onAddTrack] mediaStream tracks: ", tracks);

      setStream(new MediaStream(tracks));

      InCallManager.setForceSpeakerphoneOn(true);
    };

    const onRemoveTrack = (track) => {
      console.log("onRemoveTrack", track);
      remoteStream.removeTrack(track.track);

      const tracks = remoteStream.getTracks();

      console.log("[onRemoveTrack] mediaStream tracks: ", tracks);
    };

    let isFront = true;

    const createdStream  = await mediaDevices.getUserMedia({
      audio: true,
      // @ts-ignore
      video: {
        facingMode: (isFront ? "user" : "environment"),
      },
    }) as MediaStream;

    setLocalStream(createdStream);
    console.log("> localStream: ", createdStream);

    /**
     * Capture logic test
     */
    // const capture = await avcoreCloudClient.create(
    //   API_OPERATION.PUBLISH,
    //   "stream123",
    //   {
    //     kinds: ["video", "audio"],
    //     // @ts-ignore
    //     deviceHandlerName: "ReactNative",
    //   },
    // );

    // await capture.publish(createdStream);

    /**
     * Camera switch test logic
     */
    // setTimeout(() => {
    //   createdStream.getVideoTracks().forEach((track) => {
    //     console.log("> Changing camera for track");
    //     // @ts-ignore
    //     track._switchCamera();
    // });
    // }, 6000);


    /**
     * Video start/stop test logic
     */
    // setTimeout(() => {
    //   createdStream.getVideoTracks().forEach((track) => {
    //     track.stop();
    //     capture.removeTrack(track);
    //   });

    //   console.log("> Stopped video tracks");

    //   setTimeout(async () => {
    //     const newMediaStream = await mediaDevices.getUserMedia({
    //       // @ts-ignore
    //       video: {
    //         facingMode: (isFront ? "user" : "environment"),
    //       },
    //     }) as MediaStream;

    //     newMediaStream.getVideoTracks().forEach((track) => {
    //       createdStream.addTrack(track);
    //       capture.addTrack(track);
    //     });

    //     const tracks = createdStream.getTracks();

    //     setLocalStream(new MediaStream(tracks));

    //     console.log("> added video tracks: ", tracks)
    //   }, 5000);
    // }, 10000);

    /**
     * Microphone start/stop test logic
     */
    // setTimeout(() => {
    //   createdStream.getAudioTracks().forEach((track) => {
    //     track.stop();
    //     capture.removeTrack(track);
    //   });

    //   console.log("> Stopped audio tracks");

    //   setTimeout(async () => {
    //     const newMediaStream = await mediaDevices.getUserMedia({
    //       audio: true,
    //     }) as MediaStream;

    //     newMediaStream.getAudioTracks().forEach((track) => {
    //       createdStream.addTrack(track);
    //       capture.addTrack(track);
    //     });

    //     const tracks = createdStream.getTracks();

    //     setLocalStream(new MediaStream(tracks));

    //     console.log("> added audio tracks: ", tracks);
    //   }, 5000);
    // }, 10000);

    console.log("> localStream published");


    /**
     * Playback logic test
     */
    const playback = await avcoreCloudClient.create(
      API_OPERATION.SUBSCRIBE,
      "b4e9b323-5698-4eee-bd4c-9af58572499e",
      {
        kinds: ["video", "audio"],
        // @ts-ignore
        deviceHandlerName: "ReactNative",
      },
    );

    playback
      .on("addtrack", onAddTrack)
      .on("removetrack", onRemoveTrack);

    const remoteStream = await playback.subscribe() as MediaStream;


    console.log("> remoteStream: ", remoteStream);
  };

  useEffect(() => {
    if (cloud) {
      createStream();
    }
  }, [cloud]);

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.BLACK }}>
      <PageWrapper>

        <NavigationBar>
          <LeftItem />
          <CenterItem>
            <NavigationText>Feed</NavigationText>
          </CenterItem>
          <RightItem />
        </NavigationBar>

        <CallWrapper>
          {localStream && <CallVideo streamURL={localStream.toURL()} />}
          {stream && <CallVideo streamURL={stream.toURL()} />}
        </CallWrapper>

      </PageWrapper>
    </SafeAreaView>
  );
};
