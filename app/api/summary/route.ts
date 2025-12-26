
// import { NextRequest, NextResponse } from 'next/server';
// import { publicApiClient } from '@/lib/utils/publicClient';
// import { MarketSummaryStats } from '@/lib/api/types';

// export async function GET(request: NextRequest) {
//   try {
//     const data = await publicApiClient.get<MarketSummaryStats>("/Summary")

//     return NextResponse.json(data);
//   } catch (error: any) {
//     console.error('API Route Error:', error);
//     return NextResponse.json(
//       { 
//         error: error.response?.data?.message || 'Failed to fetch market summary',
//         details: error.message 
//       },
//       { status: error.response?.status || 500 }
//     );
//   }

// }

