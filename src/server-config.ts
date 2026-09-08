import { configureServerFunctionsServer } from "@solidjs/web/server-functions/server";
import { createFlightDataCollector } from "@solidjs/router/server";

import { Router } from "./router";

configureServerFunctionsServer({
  collectFlightData: createFlightDataCollector(Router),
});
