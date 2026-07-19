export interface Group {
  id: string;
  name: string;
  startStationId: number | null;
  finishedAt: string | null;
  createdAt: string;
}

export interface Station {
  id: number;
  name: string;
  token: string;
  hint: string;
  isFinal: boolean;
}

export interface GroupStation {
  id: string;
  groupId: string;
  stationId: number;
  unlockedAt: string;
}

export interface Photo {
  id: string;
  groupId: string;
  stationId: number;
  url: string;
  uploadedAt: string;
}
