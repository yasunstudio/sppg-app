import { Metadata } from 'next'
import { CreateUserRole } from '../components/create-user-role'

export const metadata: Metadata = {
  title: 'Assign User Role | SPPG',
  description: 'Assign a new role to a user in the SPPG system.',
}

export default function AssignUserRolePage() {
  return <CreateUserRole />
}
