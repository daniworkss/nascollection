import { Card,CardContent } from "./card"
import Link from "next/link"
export default function QuickActionCard({ title, description, icon, link }) {
    return (
      <Link href={link} className="block">
        <Card className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
          <CardContent className="p-5">
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
              <div>
                <h4 className="font-poppins-medium text-gray-800">{title}</h4>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }