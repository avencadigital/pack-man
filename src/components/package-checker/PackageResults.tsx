"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, CheckCircle2Icon } from "lucide-react";
import { PackageInfo } from "@/types/package";
import { PackageCard } from "./PackageCard";

/**
 * Props for the PackageResults component with accessibility-focused design.
 *
 * @interface PackageResultsProps
 * @description Defines the interface for displaying package analysis results in an
 * accessible accordion format. Results are grouped by status with clear visual and
 * semantic indicators for different package states.
 *
 * @accessibility
 * - Accordion items should have proper ARIA labels and states
 * - Status groups should be clearly identified with headings
 * - Package counts should be announced in group headers
 * - Color coding should be supplemented with icons and text
 * - Keyboard navigation should work smoothly between accordion items
 *
 * @wcag
 * - 1.3.1 Info and Relationships: Content structure is programmatically determinable
 * - 1.4.1 Use of Color: Color is not the only means of conveying information
 * - 2.1.1 Keyboard: All functionality available via keyboard
 * - 4.1.2 Name, Role, Value: UI components have accessible names and roles
 *
 * @example
 * `	sx
 * <PackageResults
 *   results={[
 *     { name: "react", status: "up-to-date", ... },
 *     { name: "lodash", status: "outdated", ... }
 *   ]}
 * />
 * `
 */
import { UpdatePackages } from "./UpdatePackages";

interface PackageResultsProps {
  /**
   * Array of package analysis results to display.
   */
  results: PackageInfo[];
  /**
   * The original content of the package file.
   */
  originalContent: string;
  /**
   * The name of the package file.
   */
  fileName: string;
}

export function PackageResults({
  results,
  originalContent,
  fileName,
}: PackageResultsProps) {
  const upToDatePackages = results.filter((pkg) => pkg.status === "up-to-date");
  const outdatedPackages = results.filter((pkg) => pkg.status === "outdated");
  const errorPackages = results.filter((pkg) => pkg.status === "error");

  return (
    <>
      {/* Update Packages Component - Only show if there are outdated packages */}
      {outdatedPackages.length > 0 && (
        <UpdatePackages
          originalContent={originalContent}
          packages={results}  // Pass all packages for complete context
          fileName={fileName}
        />
      )}

      <Accordion
        type="multiple"
        defaultValue={["outdated", "up-to-date"]}
        className="w-full"
      >
        {/* Outdated Packages */}
        <AccordionItem value="outdated">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="font-medium">Outdated Packages</span>
              <Badge variant="destructive" className="ml-auto">
                {outdatedPackages.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 sm:space-y-4">
              {outdatedPackages.length > 0 ? (
                outdatedPackages.map((pkg, index) => (
                  <PackageCard key={index} pkg={pkg} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No outdated packages found
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Up-to-date Packages */}
        <AccordionItem value="up-to-date">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <CheckCircle2Icon className="w-5 h-5 text-green-600" />
              <span className="font-medium">Up-to-date Packages</span>
              <Badge variant="secondary" className="ml-auto">
                {upToDatePackages.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 sm:space-y-4">
              {upToDatePackages.length > 0 ? (
                upToDatePackages.map((pkg, index) => (
                  <PackageCard key={index} pkg={pkg} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No up-to-date packages found
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Error Packages */}
        {errorPackages.length > 0 && (
          <AccordionItem value="error">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium">
                  Packages with Errors ({errorPackages.length})
                </span>
                <Badge variant="destructive" className="ml-auto">
                  {errorPackages.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 sm:space-y-4">
                {errorPackages.map((pkg, index) => (
                  <PackageCard key={index} pkg={pkg} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </>
  );
}
