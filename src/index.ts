import * as core from "@actions/core";
import * as github from "@actions/github";
import * as util from "node:util";

export interface PackageChangeDetectorActionOptions {
	githubToken: string;
	owner: string;
	properties: string[];
	refPrevious: string;
	refUpdated: string;
	repo: string;
}

export async function packageChangeDetectorAction({
	owner,
	properties,
	refPrevious,
	refUpdated,
	repo,
}: PackageChangeDetectorActionOptions) {
	core.debug(`Comparing package.json at ${refPrevious} and ${refUpdated}`);

	const [packageJsonPrevious, packageJsonUpdated] = await Promise.all([
		getPackageJsonAt(refPrevious),
		getPackageJsonAt(refUpdated),
	]);

	const changed = properties.some(
		(property) =>
			!util.isDeepStrictEqual(
				packageJsonPrevious[property],
				packageJsonUpdated[property],
			),
	);

	core.setOutput("changed", changed.toString());

	async function getPackageJsonAt(ref: string) {
		const response = await fetch(
			`https://raw.githubusercontent.com/${owner}/${repo}/${ref}/package.json`,
		);

		const body = await response.text();

		core.debug(`Body at ${ref}: ${body}`);

		return JSON.parse(body) as Record<string, unknown>;
	}
}
