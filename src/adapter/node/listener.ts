import { IncomingMessage, ServerResponse } from "http";
import { FetchCallback } from "./types";

export const getListener = (fetchCallback: FetchCallback) => {
  return async (req: IncomingMessage, res: ServerResponse) => {
    res.write("Not Implemented!");
    res.end();
  };
};
