"use client";
import React from "react";
import { CalculatorIcon, RotateCcwIcon } from "lucide-react";

const Page = () => {
  return (
    <div className="min-h mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-0 lg:w-[80vw] xl:w-[70vw] my-6">
      <div className="flex flex-wrap gap-2 items-center">
        <h1 className="text-2xl sm:text-3xl font-semibold">Bonus Share Adjustment</h1>
        <span className="text-2xl sm:text-3xl font-semibold text-green-500">
          Calculator
        </span>
      </div>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
        Calculate adjusted market price after bonus share announcement
      </p>

      <div className="my-6  border-t border-gray-200 dark:border-gray-700"></div>

      <div className="flex my-12 flex-col md:flex-row gap-6 lg:gap-8 w-full justify-center">
        
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Market Price (Before Book Closure)
              </label>
              <input
                type="number"
                placeholder="e.g., 1000"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                % of Bonus Share
              </label>
              <input
                type="number"
                placeholder="e.g., 10"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div className="flex gap-4 items-center pt-2">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium p-3 rounded-xl transition-colors">
                Calculate
              </button>
              <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <RotateCcwIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center h-full text-center px-2">
            <CalculatorIcon className="text-emerald-600 w-12 h-12 sm:w-16 sm:h-16 mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No calculation yet!
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xs sm:max-w-sm">
              Enter the market price and bonus percentage, then click Calculate to
              see the adjusted price.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
