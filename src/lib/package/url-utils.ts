import { PackageInfo } from "@/types/package";

/**
 * Generates the appropriate package registry URL for a given package
 * @param pkg - Package information object
 * @returns URL to the package on its respective registry
 * 
 * @example
 * getPackageUrl({ name: "react", packageManager: "npm" }) 
 * // "https://www.npmjs.com/package/react"
 */
export function getPackageUrl(pkg: PackageInfo): string {
  switch (pkg.packageManager) {
    case "npm":
      return `https://www.npmjs.com/package/${pkg.name}`;
    case "pip":
      return `https://pypi.org/project/${pkg.name}/`;
    case "pub":
      return `https://pub.dev/packages/${pkg.name}`;
    default:
      return pkg.homepage || "#";
  }
}
