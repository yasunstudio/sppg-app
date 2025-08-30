import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function UsersPage() {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/dashboard")
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      roles: {
        select: {
          role: {
            select: {
              name: true
            }
          }
        }
      },
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border-0">
        <div className="p-4">
          <div className="flex justify-end items-center mb-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Add New User
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.roles[0]?.role.name === "ADMIN" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {user.roles[0]?.role.name || "USER"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
