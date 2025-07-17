'use client'
import React, { useState } from 'react'
import {
  Users,
  Award,
  BarChart3,
  Target,
  Gift,
} from 'lucide-react'
import { LeaderboardItem } from './LeaderboardItem'
import { Table, TableHeader, TableBody, TableHead, TableRow } from '@/components/ui/table'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
export function Leaderboard() {
  const [activeTab, setActiveTab] = useState('players')
  const leaderboardData = [
    {
      rank: 1,
      name: 'EcoWarrior',
      role: 'Player Org',
      points: 9840,
      missions: 42,
      status: 'approved',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    },
    {
      rank: 2,
      name: 'ClimateDefender',
      role: 'Mission Creator',
      points: 8750,
      missions: 36,
      status: 'approved',
      avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    },
    {
      rank: 3,
      name: 'GreenTech',
      role: 'Player Org',
      points: 7890,
      missions: 33,
      status: 'approved',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      rank: 4,
      name: 'EarthGuardian',
      role: 'Reward Creator',
      points: 7560,
      missions: 29,
      status: 'approved',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    },
    {
      rank: 5,
      name: 'OceanProtector',
      role: 'Player Org',
      points: 6980,
      missions: 27,
      status: 'approved',
      avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
    },
    {
      rank: 6,
      name: 'SustainableFuture',
      role: 'Mission Creator',
      points: 6540,
      missions: 25,
      status: 'pending',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    {
      rank: 7,
      name: 'RenewableEnergy',
      role: 'Player Org',
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
              Top contributors and organizations in the network
            </p>
          </div>
        </header>
        <Card>
          <div className="flex border-b border-gray-700 px-4">
            <button
                onClick={() => setActiveTab('players')}
                className={`py-3 px-4 font-medium flex items-center ${activeTab === 'players' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}
            >
              <Users size={18} className="mr-2" />
              Players
            </button>
            <button
                onClick={() => setActiveTab('missions')}
                className={`py-3 px-4 font-medium flex items-center ${activeTab === 'missions' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}
            >
              <Target size={18} className="mr-2" />
              Missions
            </button>
            <button
                onClick={() => setActiveTab('rewards')}
                className={`py-3 px-4 font-medium flex items-center ${activeTab === 'rewards' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}
            >
              <Gift size={18} className="mr-2" />
              Rewards
            </button>
          </div>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="mt-6 flex items-center">
                <Award size={20} className="mr-2 text-yellow-500" />
                Top Contributors
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
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
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