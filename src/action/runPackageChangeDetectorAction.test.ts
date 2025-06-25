import type * as github from "@actions/github";

import { describe, expect, it, vi } from "vitest";

import { runPackageChangeDetectorAction } from "./runPackageChangeDetectorAction.js";

const mockGetMultilineInput = vi.fn();
const mockSetFailed = vi.fn();

vi.mock("@actions/core", () => ({
	get getMultilineInput() {
		return mockGetMultilineInput;
	},
	get setFailed() {
		return mockSetFailed;
	},
}));

const mockPackageChangeDetectorAction = vi.fn();

vi.mock("../index.js", () => ({
	get packageChangeDetectorAction() {
		return mockPackageChangeDetectorAction;
	},
}));

describe(runPackageChangeDetectorAction, () => {
	it("sets a failure if there is no pull_request or pull_request_target in the payload", async () => {
		const context = {
			payload: {},
		} as typeof github.context;

		await runPackageChangeDetectorAction(context);

		expect(mockSetFailed).toHaveBeenCalledWith(
			"This action can only be used in a pull_request or pull_request_target event.",
		);
		expect(mockPackageChangeDetectorAction).not.toHaveBeenCalled();
	});

	it("sets a failure if a pull_request base has no SHA", async () => {
		const context = {
			payload: {
				pull_request: {
					base: {},
					head: {
						sha: "abc123",
					},
				},
			},
		} as unknown as typeof github.context;

		await runPackageChangeDetectorAction(context);

		expect(mockSetFailed).toHaveBeenCalledWith(
			"The payload base SHA must be a string.",
		);
		expect(mockPackageChangeDetectorAction).not.toHaveBeenCalled();
	});

	it("sets a failure if a pull_request head has no SHA", async () => {
		const context = {
			payload: {
				pull_request: {
					base: {
						sha: "",
					},
					head: {},
				},
			},
		} as unknown as typeof github.context;

		await runPackageChangeDetectorAction(context);

		expect(mockSetFailed).toHaveBeenCalledWith(
			"The payload head SHA must be a string.",
		);
		expect(mockPackageChangeDetectorAction).not.toHaveBeenCalled();
	});

	it("calls packageChangeDetectorAction when payload pull_request has base and head SHAs", async () => {
		const properties = "engines,exports";
		const refBase = "abc123";
		const refHead = "def456";
		const owner = "test-owner";
		const repo = "test-repo";
		const context = {
			payload: {
				pull_request: {
					base: {
						sha: refBase,
					},
					head: {
						sha: refHead,
					},
				},
			},
			properties,
			repo: { owner, repo },
		} as unknown as typeof github.context;

		mockGetMultilineInput.mockReturnValueOnce(properties);

		await runPackageChangeDetectorAction(context);

		expect(mockPackageChangeDetectorAction).toHaveBeenCalledWith({
			owner,
			properties,
			refBase,
			refHead,
			repo,
		});
	});
});
