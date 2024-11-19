import { Models } from "node-appwrite";

export enum RoomType {
    TEXT = "TEXT",
    AUDIO = "AUDIO",
    VIDEO = "VIDEO"
}

export type Room = Models.Document & {
    name: string;
    roomType: RoomType;
    roomId: string;
};