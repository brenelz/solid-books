import * as v from "valibot";

export default {
  server: {
    DATABASE_URL: v.optional(v.pipe(v.string(), v.minLength(1))),
    DATABASE_URL_UNPOOLED: v.optional(v.pipe(v.string(), v.minLength(1))),
  },
  client: {
    VITE_APP_NAME: v.optional(v.pipe(v.string(), v.minLength(1)), "Solid App"),
  },
};
