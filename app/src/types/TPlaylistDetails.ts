import { Music } from "~/models";

export type TPlaylistDetails = {
  title: string;
  totalVideos: string;
  thumbnail: string;
  videos: Music[];
};
