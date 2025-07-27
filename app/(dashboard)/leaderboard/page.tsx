'use client'
import React from 'react'
import {
    Award,
    BarChart3,
} from 'lucide-react'
import { LeaderboardItem } from '@/components/leaderboard/leaderboard-item'
import { Table, TableHeader, TableBody, TableHead, TableRow } from '@/components/ui/table'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
export default function Leaderboard() {
    const leaderboardData = [
        {
            rank: 1,
            name: 'EcoWarrior',
            points: 9840,
            missions: 42,
            status: 'approved',
            avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        },
        {
            rank: 2,
            name: 'ClimateDefender',
            points: 8750,
            missions: 36,
            status: 'approved',
            avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
        },
        {
            rank: 3,
            name: 'GreenTech',
            points: 7890,
            missions: 33,
            status: 'approved',
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        },
        {
            rank: 4,
            name: 'EarthGuardian',
            points: 7560,
            missions: 29,
            status: 'approved',
            avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
        },
        {
            rank: 5,
            name: 'OceanProtector',
            points: 6980,
            missions: 27,
            status: 'approved',
            avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
        },
        {
            rank: 6,
            name: 'SustainableFuture',
            points: 6540,
            missions: 25,
            status: 'pending',
            avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        },
        {
            rank: 7,
            name: 'RenewableEnergy',
            points: 5890,
            missions: 22,
            status: 'approved',
            avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
        },
    ]
    return (
        <div>
            <header className="mb-8">
                <div className="mb-4">
                    <h2 className="text-3xl font-bold">Leaderboard</h2>
                    <p className="text-gray-400 mt-1">
                        Top players in the Mission 1.5° community
                    </p>
                </div>
            </header>
            <Card>
                <CardContent>
                    <div className="flex items-center justify-between mb-4">
                        <CardTitle className="mt-6 flex items-center">
                            <Award size={20} className="mr-2 text-yellow-500" />
                            Top Players
                        </CardTitle>
                        <div className="flex items-center bg-[#1c2432] rounded-md px-3 py-1">
                            <BarChart3 size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-300">This Month</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">Rank</TableHead>
                                    <TableHead>Player</TableHead>
                                    <TableHead>Points</TableHead>
                                    <TableHead>Missions</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leaderboardData.map((item) => (
                                    <LeaderboardItem key={item.rank} item={item} />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}