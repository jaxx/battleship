import * as path from "path";

interface GitRepository {
    show: (args: string[], handlerFn: (err: Error, value: string) => void) => GitRepository;
}

var git = require("simple-git");

var repository: GitRepository = git(path.join(__dirname, "..", ".."));

export function getVersion(callback: (version: string) => void) {
    repository.show(["-s", "--format=%ct-%h", "HEAD"], (err, value) => {
        callback("0.0.1-" + value.trim());
    });
}
