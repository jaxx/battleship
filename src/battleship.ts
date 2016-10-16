import * as application from "./server/application";
import { getVersion } from "./server/version";

getVersion(version => {
    let app = new application.Application(version);
    app.run();
});
