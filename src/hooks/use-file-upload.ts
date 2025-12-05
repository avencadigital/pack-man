"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseFileUploadProps {
  onFileContentChange: (content: string) => void;
  onFileSelect: (file: File | null) => void;
}

export function useFileUpload({ onFileContentChange, onFileSelect }: UseFileUploadProps) {
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      const allowedTypes = ['.json', '.txt', '.yaml', '.yml'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        toast({
          title: "Tipo de arquivo inválido",
          description: "Formatos suportados: .json, .txt, .yaml, .yml",
          variant: "destructive",
        });
        return;
      }

      onFileSelect(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileContentChange(content);
      };
      reader.readAsText(file);
    }
  }, [onFileContentChange, onFileSelect, toast]);

  return {
    handleFileUpload,
  };
}