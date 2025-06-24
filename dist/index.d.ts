export interface PackageChangeDetectorActionOptions {
    properties: string[];
}
export declare function packageChangeDetectorAction({ properties, }: PackageChangeDetectorActionOptions): Promise<boolean>;
