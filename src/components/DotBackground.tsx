"use client";

/**
 * DotBackground - Noise texture background with dots pattern
 * Supports both light and dark themes
 */
export function DotBackground() {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none">
            {/* Light mode dots */}
            <div
                className="absolute inset-0 bg-white dark:hidden"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.25) 1px, transparent 0)",
                    backgroundSize: "20px 20px",
                }}
            />
            {/* Dark mode dots */}
            <div
                className="absolute inset-0 hidden dark:block bg-neutral-950"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.12) 1px, transparent 0)",
                    backgroundSize: "20px 20px",
                }}
            />
        </div>
    );
}
