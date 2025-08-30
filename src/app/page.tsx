import { redirect } from 'next/navigation'

export default function Home() {
  // In a real app, you might check for an existing session here
  // and redirect to /dashboard if logged in, otherwise to /login.
  redirect('/login')
}
