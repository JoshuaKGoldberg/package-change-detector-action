import { describe, expect, it, vi } from "vitest";

import { packageChangeDetectorAction } from "./index.js";

const mockDebug = vi.fn();
const mockSetOutput = vi.fn();

vi.mock("@actions/core", () => ({
	get debug() {
		return mockDebug;
	},
	get setOutput() {
		return mockSetOutput;
	},
}));

const owner = "test-owner";
const refBase = "abc123";
const refHead = "def456";
const repo = "test-repo";

describe(packageChangeDetectorAction, () => {
	it("resolves with false when one property is provided and it did not change", async () => {
		const properties = ["engines"];

		globalThis.fetch = vi
			.fn()
			.mockResolvedValueOnce({
				text: () =>
					Promise.resolve(
						JSON.stringify({ engines: "node >= 22", other: "a" }),
					),
			})
			.mockResolvedValueOnce({
				text: () =>
					Promise.resolve(
						JSON.stringify({ engines: "node >= 22", other: "b" }),
					),
			});

		await packageChangeDetectorAction({
			owner,
			properties,
			refBase,
			refHead,
			repo,
		});

		expect(mockSetOutput).toHaveBeenCalledWith("changed", "false");
	});

	it("resolves with false when multiple properties are provided across lines and none changed", async () => {
		const properties = ["engines", "exports,type"];

		globalThis.fetch = vi
			.fn()
			.mockResolvedValueOnce({
				text: () =>
					Promise.resolve(
						JSON.stringify({ engines: "node >= 22", other: "a" }),
					),
			})
			.mockResolvedValueOnce({
				text: () =>
					Promise.resolve(
						JSON.stringify({ engines: "node >= 22", other: "b" }),
					),
			});

		await packageChangeDetectorAction({
			owner,
			properties,
			refBase,
			refHead,
			repo,
		});

		expect(mockSetOutput).toHaveBeenCalledWith("changed", "false");
	});

	it("resolves with true when one property is provided and it changed", async () => {
		const properties = ["engines"];

		globalThis.fetch = vi
			.fn()
			.mockResolvedValueOnce({
				text: () =>
					Promise.resolve(
						JSON.stringify({ engines: "node >= 20", other: "a" }),
					),
			})
			.mockResolvedValueOnce({
				text: () =>
					Promise.resolve(
						JSON.stringify({ engines: "node >= 22", other: "b" }),
					),
			});

		await packageChangeDetectorAction({
			owner,
			properties,
			refBase,
			refHead,
			repo,
		});

		expect(mockSetOutput).toHaveBeenCalledWith("changed", "true");
	});

	it("resolves with true when multiple properties are provided across lines and one changed", async () => {
		const properties = ["engines", "exports,type"];

		globalThis.fetch = vi
			.fn()
			.mockResolvedValueOnce({
				text: () =>
					Promise.resolve(
						JSON.stringify({ engines: "node >= 20", other: "a" }),
					),
			})
			.mockResolvedValueOnce({
				text: () =>
					Promise.resolve(
						JSON.stringify({ engines: "node >= 22", other: "b" }),
					),
			});

		await packageChangeDetectorAction({
			owner,
			properties,
			refBase,
			refHead,
			repo,
		});

		expect(mockSetOutput).toHaveBeenCalledWith("changed", "true");
	});

	it("resolves with true when multiple properties are provided across lines and two changed", async () => {
		const properties = ["engines", "exports,type"];

		globalThis.fetch = vi
			.fn()
			.mockResolvedValueOnce({
				text: () =>
					Promise.resolve(
						JSON.stringify({ engines: "node >= 20", type: "commonjs" }),
					),
			})
			.mockResolvedValueOnce({
				text: () =>
					Promise.resolve(
						JSON.stringify({ engines: "node >= 22", type: "module" }),
					),
			});

		await packageChangeDetectorAction({
			owner,
			properties,
			refBase,
			refHead,
			repo,
		});

		expect(mockSetOutput).toHaveBeenCalledWith("changed", "true");
	});
});
