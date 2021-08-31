import { client } from "./structures/Client";
import { token, mongoose } from "./config.json";

export const manager = new client({ token, mongoose });
manager.start();
