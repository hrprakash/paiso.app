// app/api/nepse/news/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { publicApiNewsClient } from '@/lib/utils/publicNews';
import { publicApiClient } from '@/lib/utils/publicClient';
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    
    const data = await publicApiClient.get(`/nepse/news/${params.id}/`);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: error.response?.data?.message || 'Failed to fetch news',
        details: error.message 
      },
      { status: error.response?.status || 500 }
    );
  }
}