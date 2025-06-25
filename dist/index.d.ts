export interface PackageChangeDetectorActionOptions {
    githubToken: string;
    owner: string;
    properties: string[];
    refPrevious: string;
    refUpdated: string;
    repo: string;
}
export declare function packageChangeDetectorAction({ owner, properties, refPrevious, refUpdated, repo, }: PackageChangeDetectorActionOptions): Promise<void>;
