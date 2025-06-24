import * as core from "@actions/core";
import * as github from "@actions/github";

import { packageChangeDetectorAction } from "../index.js";

export async function runPackageChangeDetectorAction(
	context: typeof github.context,
) {
	const properties = core.getMultilineInput("properties");

	await packageChangeDetectorAction({
		properties,
	});
}
