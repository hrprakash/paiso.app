import { NextResponse } from 'next/server';
import { publicApiClient } from '@/lib/utils/publicClient';
import { CompanyList } from '@/lib/api/types';
export async function GET() {
  try {
    const data = await publicApiClient.Keyget(`/nepse/company/`) as CompanyList[];
    
    
    return NextResponse.json({
      success: true,
      data: data,
    });
    
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get company list',
        details: error.message 
      },
      { status: 500 }
    );
  }
}