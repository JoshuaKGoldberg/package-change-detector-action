import * as github from "@actions/github";

import { runPackageChangeDetectorAction } from "./runPackageChangeDetectorAction.ts";

await runPackageChangeDetectorAction(github.context);
