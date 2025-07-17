import React from 'react'
import { CheckCircle, Clock } from 'lucide-react'
import { TableRow, TableCell } from '@/components/ui/table'
interface LeaderboardItemProps {
  item: {
    rank: number
    name: string
    role: string
    points: number
    missions: number
    status: string
    avatar: string
  }
}
export function LeaderboardItem({ item }: LeaderboardItemProps) {
  const { rank, name, role, points, missions, status, avatar } = item
  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500 text-black'
    if (rank === 2) return 'bg-gray-300 text-black'
    if (rank === 3) return 'bg-amber-700 text-white'
    return 'bg-[#1c2432] text-white'
  }
  const getRoleStyle = (role: string) => {
    if (role === 'Player Org') return 'bg-blue-900 text-blue-300'
    if (role === 'Mission Creator') return 'bg-teal-900 text-teal-300'
    if (role === 'Reward Creator') return 'bg-purple-900 text-purple-300'
    return 'bg-gray-800 text-gray-300'
  }
  return (
      <TableRow>
        <TableCell>
          <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${getRankStyle(rank)}`}
          >
            {rank}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center">
            <img
                src={avatar}
                alt={name}
                className="w-10 h-10 rounded-full mr-3"
            />
            <span className="font-medium">{name}</span>
          </div>
        </TableCell>
        <TableCell>
        <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${getRoleStyle(role)}`}
        >
          {role}
        </span>
        </TableCell>
        <TableCell className="font-medium">{points.toLocaleString()}</TableCell>
        <TableCell>{missions}</TableCell>
        <TableCell>
          {status === 'approved' ? (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-green-500 dark:bg-green-900/30 dark:text-green-400 text-xs">
            <CheckCircle size={14} className="mr-1" />
            Approved
          </span>
          ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs">
            <Clock size={14} className="mr-1" />
            Pending
          </span>
          )}
        </TableCell>
      </TableRow>
  )
}