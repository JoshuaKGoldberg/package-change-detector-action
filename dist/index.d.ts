export interface PackageChangeDetectorActionOptions {
    owner: string;
    properties: string[];
    refBase: string;
    refHead: string;
    repo: string;
}
export declare function packageChangeDetectorAction({ owner, properties, refBase, refHead, repo, }: PackageChangeDetectorActionOptions): Promise<void>;
