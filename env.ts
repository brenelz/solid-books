import * as v from "valibot";

export default {
  server: {
    POSTGRES_URL: v.optional(v.pipe(v.string(), v.minLength(1))),
  },
  client: {
    VITE_APP_NAME: v.optional(v.pipe(v.string(), v.minLength(1)), "Solid App"),
  },
};
