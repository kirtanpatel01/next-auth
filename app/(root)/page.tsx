import { redirect } from 'next/navigation'
import React from 'react'

function page() {
  redirect('/habits')
}

export default page