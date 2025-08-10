import { Card,CardContent,CardHeader,CardTitle } from "./card"
import { TrendingUp } from "lucide-react"
export default function StatCard({ title, value, icon, trend, trendUp }) {
    return (
      <Card className="rounded-xl border border-gray-200 shadow-sm overflow-hidden  ">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-5 px-5">
          <CardTitle className="text-sm font-optima-medium text-gray-500">{title}</CardTitle>
          <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="text-2xl font-poppins-medium mt-2">{value}</div>
          {trend && (
            <div className={`flex items-center mt-1 text-xs font-optima-medium ${
              trendUp ? 'text-green-600' : 'text-red-600'
            }`}>
              {trendUp ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
              )}
              <span>{trend} from last month</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }