"use client"
import { useState, useEffect } from 'react';
import { ArrowUpDown, TrendingUp, TrendingDown, Search, X, ChevronDown, Building2 } from 'lucide-react';
import { summaryApi } from '@/lib/api/summary';
import { CompanyList } from '@/lib/api/types';
import React from 'react'

const page = () => {
  const [AllCompanies, setAllCompanies] = useState<CompanyList[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState("all");

  useEffect(() => {
    const companylist = async () => {

      try {
        setLoading(true)
        const response = await summaryApi.companyList()
        console.log(response.data);

        if (response.success && response.data) {
          setAllCompanies(response.data);
        }
      } catch (error) {
        console.log("companylist", error);

      } finally {
        setLoading(false)
      }
    }


    companylist()
  }, [])

  useEffect(() => {
    let filtered = AllCompanies

    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedSector !== "all") {
      filtered = filtered.filter(company => company.sector === parseInt(selectedSector));
    }

    // setFilteredCompanies(filtered);
  }, [searchTerm, selectedSector, AllCompanies]);


  const clearSearch = () => {
    setSearchTerm("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <div className='flex items-center justify-center my-8'>
        <h1 className='text-4xl font-ovo font-semibold '>Company List</h1>
      </div>

      <div className='max-w-7xl mx-auto' >
        <div className='grid grid-cols-1'>
    <div className='bg-white rounded-lg shadow p-6'>
      <div className='flex items-center justify-between'>
<div>
  <p className='text-lg text-gray-600'>Total Companies</p>
  <p className="text-md font-bold text-gray-900">{AllCompanies.length}</p>
  <Building2 className="w-8 h-8 text-black opacity-20" />
</div>
      </div>


<div className='bg-white rounded-lg shadoe p-6'>
  <div className='flex items-center justify-between'>
    <div>
      <p className='text-lg'></p>
    </div>
  </div>
</div>
    </div>
        </div>
      </div>
    </div>
  )
}

export default page
