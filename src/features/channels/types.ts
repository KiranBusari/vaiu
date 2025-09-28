import { Models } from "node-appwrite";

export enum RoomType {
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

export type Room = Models.Document & {
  name: string;
  roomType: RoomType;
  roomId: string;
};
