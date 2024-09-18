import { createRequestFx } from "./create-request-fx";

export const createInternalRequestFx = createRequestFx({
  baseURL: process.env.API_URL || "http://localhost:3000/api",
  withToken: true,
});
