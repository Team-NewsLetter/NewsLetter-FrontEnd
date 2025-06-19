import { Sort, Pageable } from "./common";

export type CardNews = {
  id: number;
  title: string;
  thumbnailUrl: string;
  newsTag: string[];
  createdAt: string;
};
export type CardNewsDetailResponseDto = {
  newsType: string;
  cardNewsItems: {
    imageUrl: string;
    description: string;
  }[];
};

export type SliceCardNewsListItemDto = {
  size: number;
  content: CardNews[];
  number: number;
  sort: Sort;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: Pageable;
  empty: boolean;
};

export type CardNewsListResponseDto = {
  cardNews: SliceCardNewsListItemDto;
};

