import React, { useState, useEffect } from 'react';

export default function Test() {

    const [ranking, setRanking] = useState(null)
    const [render, setRender] = useState(0)
    const dataArray = null

    function formatData(rank, truckId, safety_score) {
        return (
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {`${rank}`}
                </th>
                <td class="px-6 py-4">
                    {`${truckId}`}
                </td>
                <td class="px-6 py-4">
                    {`${safety_score}`}
                </td>
            </tr>
        )
    }

    function tableData() {
        for (var data in ranking) {
            if (ranking.hasOwnProperty(data)) {
                <>jioooo</>
            }
        } 
    }

    useEffect(() => {
        fetch('http://localhost:5000/ranking')
        .then(response => response.json())
        .then(data => setRanking(data))
        .catch(error => console.error(error));
    }, []); // Empty dependency array means it runs once on mount

    if (ranking) {
        return (
            <div className='flex flex-col bg-gradient-to-r from-slate-900 to-slate-700 w-full min-h-screen'>
                    <div className='flex bg-gray-700 w-fit m-8 p-2 rounded-md text-gray-50'>
                        <button onClick={event =>  window.location.href="/"}>
                            ⬅️ back
                        </button>
                    </div>
                    <div class="flex overflow-x-auto my-20 w-full justify-center items-center rounded-md">
                        <table class="w-fit text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-md">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 rounded-md">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        Rank
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Truck ID
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Safety Score
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {Object.keys(ranking).map(key => (
                                formatData(key, ranking[key].truckId, ranking[key]. safety_score)
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
        )
    } else {
        return (
            <div className='flex flex-row bg-gradient-to-r from-slate-900 to-slate-700 w-full min-h-screen justify-center'>
                <div class="relative overflow-x-auto my-20 rounded-md">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Rank
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Truck ID
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Safety Score
                                </th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        )
    }
}