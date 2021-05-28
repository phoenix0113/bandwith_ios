import React from "react";
import { FeedVideo } from "../../components/Feed/Video";

import { observer } from "mobx-react";

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba1',
    photo: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    name: 'Luis Andres 1',
    level: 'Level 1',
    video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba2',
    photo: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    name: 'Luis Andres 2',
    level: 'Level 2',
    video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba3',
    photo: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    name: 'Luis Andres 3',
    level: 'Level 3',
    video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba4',
    photo: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    name: 'Luis Andres 4',
    level: 'Level 4',
    video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba5',
    photo: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    name: 'Luis Andres 5',
    level: 'Level 5',
    video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba6',
    photo: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    name: 'Luis Andres 6',
    level: 'Level 6',
    video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba7',
    photo: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    name: 'Luis Andres 7',
    level: 'Level 7',
    video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba8',
    photo: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    name: 'Luis Andres 8',
    level: 'Level 8',
    video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba9',
    photo: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    name: 'Luis Andres 9',
    level: 'Level 9',
    video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba10',
    photo: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    name: 'Luis Andres 10',
    level: 'Level 10',
    video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
];

export const FeedScreen = observer(() => {
  
  return (
    <FeedVideo
      videoData = {DATA}
      videoID = "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba1"
    />
  );
});

