import * as core from "@actions/core";
import * as util from "node:util";

export interface PackageChangeDetectorActionOptions {
	owner: string;
	properties: string[];
	refBase: string;
	refHead: string;
	repo: string;
}

export async function packageChangeDetectorAction({
	owner,
	properties,
	refBase,
	refHead,
	repo,
}: PackageChangeDetectorActionOptions) {
	core.debug(`Comparing package.json at ${refBase} and ${refHead}`);

	const [packageJsonPrevious, packageJsonUpdated] = await Promise.all([
		getPackageJsonAt(refBase),
		getPackageJsonAt(refHead),
	]);

	const propertyKeys = properties
		.flatMap((property) => property.split(/\n,/))
		.filter(Boolean);

	core.debug(`Will check properties: ${propertyKeys.join(", ")}`);

	const changed = propertyKeys.some(
		(propertyKey) =>
			!util.isDeepStrictEqual(
				packageJsonPrevious[propertyKey],
				packageJsonUpdated[propertyKey],
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
