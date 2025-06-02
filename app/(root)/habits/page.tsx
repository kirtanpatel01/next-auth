'use client'

import HabitBox from '@/components/habit-box'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const loggedIn = searchParams.get('loggedIn')
    if (loggedIn === 'google') {
      toast.success("Logged in with Google!")
      router.replace('/habits') // remove query param from URL
    }
  }, [searchParams, router])

  return (
    <div className=''>
      <HabitBox />
    </div>
  )
}

export default Page
