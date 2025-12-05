import { useState } from "react";

/**
 * Custom hook for handling drag and drop file upload functionality.
 * 
 * @param onDrop - Callback function that receives the dropped file
 * @returns Object containing drag state and event handlers
 */
export function useDragDrop(onDrop: (file: File) => void) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onDrop(e.dataTransfer.files[0]);
        }
    };

    return { dragActive, handleDrag, handleDrop };
}
