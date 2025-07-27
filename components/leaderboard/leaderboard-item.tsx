import React from 'react'
import { TableRow, TableCell } from '@/components/ui/table'
interface LeaderboardItemProps {
  item: {
    rank: number
    name: string
    points: number
    missions: number
    avatar: string
  }
}
export function LeaderboardItem({ item }: LeaderboardItemProps) {
  const { rank, name, points, missions, avatar } = item
  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500 text-black'
    if (rank === 2) return 'bg-gray-300 text-black'
    if (rank === 3) return 'bg-amber-700 text-white'
    return 'bg-[#1c2432] text-white'
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
        <TableCell className="font-medium">{points.toLocaleString()}</TableCell>
        <TableCell>{missions}</TableCell>
      </TableRow>
  )
}