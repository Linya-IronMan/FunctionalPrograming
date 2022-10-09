import { Archive } from "libarchive.js/main.js";

Archive.init({
  workerUrl: "./external-js/libarchive-worker-bundle.js",
});

export default Archive;
