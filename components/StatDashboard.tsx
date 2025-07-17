import React from 'react'
import {
    Users,
    Building2,
    FileText,
    Target,
    TrendingUp,
    BarChart3,
    Activity,
    Clock,
} from 'lucide-react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from './ui/card'
export function StatDashboard() {
    const stats = {
        users: 12483,
        organizations: 387,
        submissions: 5642,
        missionsCreated: 924,
    }
    const recentActivity = [
        {
            type: 'user',
            action: 'joined',
            name: 'EcoWarrior',
            time: '2 minutes ago',
        },
        {
            type: 'mission',
            action: 'created',
            name: 'Coastal Cleanup',
            time: '15 minutes ago',
        },
        {
            type: 'organization',
            action: 'approved',
            name: 'Green Planet Initiative',
            time: '32 minutes ago',
        },
        {
            type: 'submission',
            action: 'reviewed',
            name: 'Reforestation Project',
            time: '1 hour ago',
        },
        {
            type: 'user',
            action: 'completed',
            name: 'ClimateDefender',
            time: '2 hours ago',
        },
    ]
    const growthData = [
        {
            month: 'Jan',
            users: 8240,
            missions: 623,
        },
        {
            month: 'Feb',
            users: 9120,
            missions: 687,
        },
        {
            month: 'Mar',
            users: 9840,
            missions: 745,
        },
        {
            month: 'Apr',
            users: 10680,
            missions: 798,
        },
        {
            month: 'May',
            users: 11520,
            missions: 856,
        },
        {
            month: 'Jun',
            users: 12483,
            missions: 924,
        },
    ]
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Users Stat Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="bg-gray-100 dark:bg-blue-900/30 p-3 rounded-lg">
                                <Users size={24} className="text-blue-400" />
                            </div>
                            <div className="bg-[#1c2432] rounded-md px-2 py-1">
                                <span className="text-xs text-green-400">+8.4%</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Total Users</CardDescription>
                        <div className="text-2xl font-bold mt-1">
                            {stats.users.toLocaleString()}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex items-center">
                            <TrendingUp size={14} className="text-green-400 mr-1" />
                            <span className="text-xs text-gray-400">
                <span className="text-green-400">243</span> new this week
              </span>
                        </div>
                    </CardFooter>
                </Card>
                {/* Organizations Stat Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="bg-gray-100 dark:bg-teal-900/30 p-3 rounded-lg">
                                <Building2 size={24} className="text-teal-400" />
                            </div>
                            <div className="bg-[#1c2432] rounded-md px-2 py-1">
                                <span className="text-xs text-green-400">+5.2%</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Organizations</CardDescription>
                        <div className="text-2xl font-bold mt-1">
                            {stats.organizations.toLocaleString()}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex items-center">
                            <TrendingUp size={14} className="text-green-400 mr-1" />
                            <span className="text-xs text-gray-400">
                <span className="text-green-400">12</span> new this week
              </span>
                        </div>
                    </CardFooter>
                </Card>
                {/* Submissions Stat Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="bg-gray-100 dark:bg-purple-900/30 p-3 rounded-lg">
                                <FileText size={24} className="text-purple-400" />
                            </div>
                            <div className="bg-[#1c2432] rounded-md px-2 py-1">
                                <span className="text-xs text-green-400">+12.7%</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Submissions</CardDescription>
                        <div className="text-2xl font-bold mt-1">
                            {stats.submissions.toLocaleString()}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex items-center">
                            <TrendingUp size={14} className="text-green-400 mr-1" />
                            <span className="text-xs text-gray-400">
                <span className="text-green-400">87</span> new this week
              </span>
                        </div>
                    </CardFooter>
                </Card>
                {/* Missions Stat Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="bg-gray-100 dark:bg-green-900/30 p-3 rounded-lg">
                                <Target size={24} className="text-green-400" />
                            </div>
                            <div className="bg-[#1c2432] rounded-md px-2 py-1">
                                <span className="text-xs text-green-400">+9.3%</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Missions Created</CardDescription>
                        <div className="text-2xl font-bold mt-1">
                            {stats.missionsCreated.toLocaleString()}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex items-center">
                            <TrendingUp size={14} className="text-green-400 mr-1" />
                            <span className="text-xs text-gray-400">
                <span className="text-green-400">34</span> new this week
              </span>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Growth Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center">
                                <BarChart3 size={20} className="mr-2 text-blue-400" />
                                Network Growth
                            </CardTitle>
                            <div className="flex items-center bg-[#1c2432] rounded-md px-3 py-1">
                                <Clock size={16} className="text-gray-400 mr-2" />
                                <span className="text-sm text-gray-300">Last 6 months</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-end justify-between">
                            {growthData.map((data, index) => (
                                <div key={index} className="flex flex-col items-center w-1/6">
                                    <div className="w-full flex justify-center space-x-1">
                                        <div
                                            className="w-3 bg-blue-500/70 rounded-t"
                                            style={{
                                                height: `${(data.users / 15000) * 200}px`,
                                            }}
                                        ></div>
                                        <div
                                            className="w-3 bg-green-500/70 rounded-t"
                                            style={{
                                                height: `${(data.missions / 1000) * 200}px`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-2">{data.month}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex items-center justify-center w-full space-x-6">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-blue-500/70 rounded mr-2"></div>
                                <span className="text-xs text-gray-400">Users</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500/70 rounded mr-2"></div>
                                <span className="text-xs text-gray-400">Missions</span>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Activity size={20} className="mr-2 text-green-400" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start">
                                    <div
                                        className={`p-2 rounded-lg mr-3 ${activity.type === 'user' ? 'bg-gray-100 dark:bg-blue-900/30 text-blue-400' : activity.type === 'mission' ? 'bg-gray-100 dark:bg-green-900/30 text-green-400' : activity.type === 'organization' ? 'bg-gray-100 dark:bg-teal-900/30 text-teal-400' : 'bg-gray-100 dark:bg-purple-900/30 text-purple-400'}`}
                                    >
                                        {activity.type === 'user' && <Users size={16} />}
                                        {activity.type === 'mission' && <Target size={16} />}
                                        {activity.type === 'organization' && (
                                            <Building2 size={16} />
                                        )}
                                        {activity.type === 'submission' && <FileText size={16} />}
                                    </div>
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-medium">{activity.name}</span>
                                            <span className="text-gray-400"> {activity.action}</span>
                                        </p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <button className="w-full py-2 text-sm dark:text-gray-400 dark:hover:font-semibold text-black hover:text-white border border-gray-700 rounded-md hover:bg-black dark:hover:bg-[#1c2432] transition-colors">
                            View All Activity
                        </button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}