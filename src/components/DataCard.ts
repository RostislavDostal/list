export interface DataCardItem {
  id: number;
  name: string;
  date: Date;
  time: string;
  hasRemoveButton: boolean;
  isFound: boolean;
}

export interface DataCardStorageItem {
  id: number;
  name: string;
  date: string;
}

export enum SortingType {
  Name = 1,
  Date = 2,
}
