export type FileStorageContract = {
  list: () => string[];
  uri: (fileName: string) => string;
  moveIn: (sourceUri: string, fileName: string) => Promise<string>;
  remove: (fileName: string) => void;
};
