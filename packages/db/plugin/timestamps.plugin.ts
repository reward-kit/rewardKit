import { Schema } from "mongoose";

export const timestampPlugin = (schema: Schema) => {
  schema.set("timestamps", {
    currentTime: () => Math.floor(Date.now() / 1000),
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  });
};
