export type Certification = {
  sequence: number;
  imageUrl: string;
};

export type CertificationListResponse = {
  totalCount: number;
  certifications: Certification[];
};

export type CertificationDetailResponse = {
  imageUrl: string;
};
