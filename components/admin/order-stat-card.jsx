import { Card, CardContent, CardHeader, CardTitle } from "./card" 
export default function OrderStatCard({ title, value, icon }) {
    return (
      <Card className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-5 px-5">
          <CardTitle className="text-sm font-optima-medium text-gray-500">{title}</CardTitle>
          <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="text-2xl font-poppins-medium mt-2">{value}</div>
        </CardContent>
      </Card>
    )
  }