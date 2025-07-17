export interface SharedFile {
  fileName: string;
  fileHash: string;
  version: number;
  owner: string;
  isDeleted: boolean;
  sharedWith: string[];
  description: string;
}
