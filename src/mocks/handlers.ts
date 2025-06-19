// import { rest } from 'msw';

// export const handlers = [
//   // 카드뉴스 리스트 응답
//   rest.get('/api/card-news', (req, res, ctx) => {
//     const page = Number(req.url.searchParams.get('page')) || 0;
//     const size = Number(req.url.searchParams.get('size')) || 10;
//     const type = req.url.searchParams.get('type') || 'daily';

//     const allNewsMap: Record<string, any[]> = {
//       urgent: [
      
//       ],
//       daily: [
//         {
//           id: 1,
//           title: "🌍 기후 위기의 진실",
//           thumbnailUrl: "https://via.placeholder.com/300x200",
//           newsTag: ["과학"],
//           newsType: "실천",
//           createdAt: "2025-06-15T12:00:00Z"
//         },
//       ],
//       practice: [
//           {
//           id: 101,
//           title: "⚠️ 긴급 기후 경고",
//           thumbnailUrl: "https://via.placeholder.com/300x200",
//           newsTag: [],
//           newsType: "실천",
//           createdAt: "2025-06-15T12:00:00Z",
//         },
//         {
//           id: 102,
//           title: "🔥 폭염으로 인한 화재 급증",
//           thumbnailUrl: "https://via.placeholder.com/300x200",
//           newsTag: [],
//           newsType: "실천",
//           createdAt: "2025-06-14T08:00:00Z",
//         },
//          {
//           id: 1,
//           title: "🌍 기후 위기의 진실",
//           thumbnailUrl: "https://via.placeholder.com/300x200",
//           newsTag: [],
//           newsType: "실천",
//           createdAt: "2025-06-15T12:00:00Z"
//         },
//         {
//           id: 201,
//           title: "🧼 에코 빨래 실천법",
//           thumbnailUrl: "https://via.placeholder.com/300x200",
//           newsTag: [],
//           newsType: "실천",
//           createdAt: "2025-06-10T12:00:00Z",
//         },
//       ],
//     };

//     const fullList = allNewsMap[type] ?? [];

//     const start = page * size;
//     const end = start + size;
//     const content = fullList.slice(start, end);
//     const totalElements = fullList.length;
//     const last = end >= totalElements;
//         console.log(type, page, content);


//     return res(
//       ctx.status(200),
//       ctx.json({
//         isSuccess: true,
//         code: "COMMON200",
//         message: "성공입니다.",
//         result: {
//           cardNews: {
//             content,
//             size,
//             number: page,
//             numberOfElements: content.length,
//             first: page === 0,
//             last,
//             empty: content.length === 0,
//             sort: {
//               sorted: true,
//               unsorted: false,
//               empty: false,
//             },
//             pageable: {
//               offset: start,
//               pageSize: size,
//               pageNumber: page,
//               paged: true,
//               unpaged: false,
//               sort: {
//                 sorted: true,
//                 unsorted: false,
//                 empty: false,
//               },
//             },
//           },
//         },
//       })
//     );
//   }),

//   // 카드뉴스 상세 응답
//  // 카드뉴스 상세 응답
// rest.get('/api/card-news/:id/detail', (req, res, ctx) => {
//   const { id } = req.params;

//   const imageDataMap: Record<string, { imageUrl: string; description: string }[]> = {
//     '101': Array.from({ length: 5 }, (_, i) => ({
//       imageUrl: `https://via.placeholder.com/300x400?text=101+컷${i + 1}`,
//       description: `카드뉴스 101 - ${i + 1}번째 컷 설명입니다.`,
//     })),
//     '102': Array.from({ length: 5 }, (_, i) => ({
//       imageUrl: `https://via.placeholder.com/300x400?text=102+컷${i + 1}`,
//       description: `카드뉴스 102 - ${i + 1}번째 컷 설명입니다.`,
//     })),
//     '1': Array.from({ length: 5 }, (_, i) => ({
//       imageUrl: `https://via.placeholder.com/300x400?text=1+컷${i + 1}`,
//       description: `카드뉴스 1 - ${i + 1}번째 컷 설명입니다.`,
//     })),
//     '201': Array.from({ length: 5 }, (_, i) => ({
//       imageUrl: `https://via.placeholder.com/300x400?text=201+컷${i + 1}`,
//       description: `카드뉴스 201 - ${i + 1}번째 컷 설명입니다.`,
//     })),
//   };

//   const cardNewsItems = imageDataMap[id as string] ?? [];

//   return res(
//     ctx.status(200),
//     ctx.json({
//       isSuccess: true,
//       code: 'COMMON200',
//       message: '성공입니다.',
//       result: {
//         cardNewsItems,
//            newsType:"실천",
//       },
//     })
//   );
// }),]
