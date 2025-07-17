export interface User {
  username: string;
  password: string;
  account: string;
}

export interface SharedFile {
  fileName: string;
  fileHash: string;
  description: string;
  version: number;
  owner: string;
  isDeleted: boolean;
  sharedWith: string[];
}
