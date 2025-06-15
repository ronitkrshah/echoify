export type TSearchPlaylist = {
  url: string;
  type: "playlist";
  name: string;
  thumbnail: string;
  uploaderName: string;
  uploaderUrl: string;
  uploaderVerified: boolean;
  playlistType: string;
  videos: number;
};
