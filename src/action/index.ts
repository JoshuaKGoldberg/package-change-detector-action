import * as github from "@actions/github";

import { runPackageChangeDetectorAction } from "./runPackageChangeDetectorAction.js";

await runPackageChangeDetectorAction(github.context);
