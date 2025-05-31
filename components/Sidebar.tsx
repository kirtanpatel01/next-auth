'use client'

import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Session } from 'next-auth'
import Image from 'next/image'

export default function Sidebar({ session }: { session: Session | null }) {
    const pathname = usePathname();
    const links = [
        { to: "/dashboard", title: 'Dashboard' },
        { to: "/habits", title: 'Habits' },
        { to: "/exercise", title: 'Exercise' },
    ]

    return (
        <div className='flex flex-col min-h-screen w-fit justify-between p-4 bg-c10 dark:bg-c90/50'>
            <div className='flex flex-col space-y-4'>
                <Link href={'/'} className='flex items-center gap-2'>
                    <span className='text-3xl font-bold tracking-wider'>DotHabits</span>
                </Link>
                <hr className='borde-c40/35' />
                {links.map((link) => (
                    <Link key={link.title} href={link.to} className={`side-btn text-lg ${pathname === link.to ? "bg-c30 border-c50 dark:border-c50/70 dark:bg-c95" : ""}`}>{link.title}</Link>
                ))}
            </div>
            <div className='flex flex-col gap-4'>
                {session ? (
                    <Link href={'/profile'}>

                        <button className='cursor-pointer w-full flex items-center gap-2 border border-c40  dark:border-black rounded-full p-1.5 bg-c05 dark:bg-c95 shadow-md dark:shadow-black/50'>
                            <Image
                                src={session.user?.image || "/profile.svg"}
                                alt={session.user?.name || "profile"}
                                height={48}
                                width={48}
                                className='rounded-full'
                            />
                            {session.user?.name}
                        </button>
                    </Link>
                ) : (
                    <Link href={'/auth/login'}>
                        <Button className='w-full cursor-pointer'>Login</Button>
                    </Link>
                )}
            </div>
        </div>
    )
}