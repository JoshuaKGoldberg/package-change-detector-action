import type { KnipConfig } from "knip";

export default {
	entry: ["src/**/*.test.*", "src/action/index.ts!"],
	ignoreExportsUsedInFile: { interface: true, type: true },
	project: ["src/**/*.ts!"],
	treatConfigHintsAsErrors: true,
} satisfies KnipConfig;
