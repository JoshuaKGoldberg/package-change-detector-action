import * as github from "@actions/github";
import * as util from "node:util";

export interface PackageChangeDetectorActionOptions {
	properties: string[];
}

export async function packageChangeDetectorAction({
	properties,
}: PackageChangeDetectorActionOptions) {
	console.log("sha:", github.context.sha);
	console.log("context:", github.context);

	// 1. Get current version of package.json
	// 2. Get previous version of package.json
	// TODO
	const currentPackageJson: Record<string, unknown> = await Promise.resolve({});
	const updatedPackageJson: Record<string, unknown> = await Promise.resolve({});

	return properties.some(
		(property) =>
			!util.isDeepStrictEqual(
				currentPackageJson[property],
				updatedPackageJson[property],
			),
	);
}
