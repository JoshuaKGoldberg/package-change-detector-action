import type * as github from "@actions/github";

import * as core from "@actions/core";

import { packageChangeDetectorAction } from "../index.js";

interface PayloadData {
	base: Record<string, unknown>;
	head: Record<string, unknown>;
}

export async function runPackageChangeDetectorAction(
	context: typeof github.context,
) {
	const payloadData = (context.payload.pull_request ??
		context.payload.pull_request_target) as PayloadData;
	if (typeof payloadData !== "object") {
		core.setFailed(
			"This action can only be used in a pull_request or pull_request_target event.",
		);
		return;
	}

	const refBase = payloadData.base.sha;
	if (typeof refBase !== "string") {
		core.setFailed("The payload base SHA must be a string.");
		return;
	}

	const refHead = payloadData.head.sha;
	if (typeof refHead !== "string") {
		core.setFailed("The payload head SHA must be a string.");
		return;
	}

	const properties = core.getMultilineInput("properties");

	await packageChangeDetectorAction({
		owner: context.repo.owner,
		properties,
		refBase,
		refHead,
		repo: context.repo.repo,
	});
}
