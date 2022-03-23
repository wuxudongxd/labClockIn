// 实验室信息
export interface lab {
  _id: string;
  name: string;
  locations: {
    latitude: number;
    longitude: number;
  }[];
}

// 新增用户
export interface userProps {
  nickName: string;
  avatarUrl: string;
  labId?: string;
  name?: string;
  studentID?: string;
}
