# Implementation Plan

- [ ] 1. Create utility functions for file handling
  - Create `src/utils/file-utils.ts` with functions to create File objects from content and filename
  - Implement `createFileFromContent` function that creates a proper File object from string content
  - Implement `getFileTypeFromName` function to detect file type from filename
  - Add unit tests for utility functions to ensure proper File object creation
  - _Requirements: 1.1, 2.2, 4.1, 4.2, 4.3, 4.4_

- [ ] 2. Modify main page component state management
  - Update `src/app/page.tsx` to modify the `onDirectAnalyze` callback implementation
  - Change callback to update `fileContent` state with GitHub content before calling `analyzePackages`
  - Change callback to update `selectedFile` state using the new utility function
  - Ensure state is properly cleared when switching between input methods
  - Add logging to verify state updates are working correctly
  - _Requirements: 1.1, 1.2, 3.1, 3.2, 5.1, 5.3_

- [ ] 3. Test copy functionality with GitHub URL flow
  - Write integration test to verify copy button works after GitHub URL analysis
  - Test that copied content contains the updated package versions, not empty content
  - Verify that the correct number of updated packages is reported in success message
  - Test copy functionality with different file types (package.json, requirements.txt, pubspec.yaml)
  - _Requirements: 1.2, 1.3, 1.4_

- [ ] 4. Test download functionality with GitHub URL flow
  - Write integration test to verify download button works after GitHub URL analysis
  - Test that downloaded file has the correct filename based on the GitHub file
  - Verify that downloaded file contains updated package versions, not empty content
  - Test download functionality with different file types and verify correct MIME types
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 5. Verify state consistency across all input methods
  - Write tests to ensure copy/download work identically for Upload, Paste, and GitHub URL methods
  - Test switching between different input methods and verify state is properly cleared
  - Verify that `fileContent` and `selectedFile` states are consistently updated regardless of input method
  - Test edge cases like switching methods mid-analysis
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.2, 5.4_

- [ ] 6. Add error handling and edge case management
  - Add error handling for File object creation failures in utility functions
  - Add validation to ensure content is not empty before copy/download operations
  - Implement fallback logic for missing or invalid file names
  - Add user-friendly error messages for copy/download failures
  - Test error scenarios and ensure graceful degradation
  - _Requirements: 5.1, 5.2, 5.3, 5.4_