import * as core from "@actions/core";
import * as github from "@actions/github";

// import { getTokenInput } from "../getTokenInput.js";
import { packageChangeDetectorAction } from "../index.js";

export async function runPackageChangeDetectorAction(
	context: typeof github.context,
) {
	const properties = core.getMultilineInput("properties");

	const { after, before } = context.payload;

	if (typeof before !== "string" || typeof after !== "string") {
		core.setFailed(
			"This action can only be used in an event with 'after' and 'before' refs.",
		);
		return;
	}

	console.log({ context });

	await packageChangeDetectorAction({
		// githubToken: getTokenInput("github-token", "GITHUB_TOKEN"),
		owner: context.repo.owner,
		properties,
		refPrevious: after,
		refUpdated: before,
		repo: context.repo.repo,
	});
}
