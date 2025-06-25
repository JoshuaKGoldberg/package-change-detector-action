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
	console.log("sha:", github.context.sha);
	console.log("context:", github.context);

	const [packageJsonPrevious, packageJsonUpdated] = await Promise.all([
		getPackageJsonAt(refPrevious),
		getPackageJsonAt(refUpdated),
	]);

	return properties.some(
		(property) =>
			!util.isDeepStrictEqual(
				packageJsonPrevious[property],
				packageJsonUpdated[property],
			),
	);

	async function getPackageJsonAt(ref: string) {
		const response = await fetch(
			`https://raw.githubusercontent.com/${owner}/${repo}/${ref}/package.json`,
		);

		return JSON.parse(await response.text()) as Record<string, unknown>;
	}
}
