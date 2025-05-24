'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import ForgetPw from '@/components/Breadcrumbs/ForgetPw'
import Link from 'next/link'

export default function ClientPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false)
    const router = useRouter();

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            console.log("page.tsx - data: ", data);

            if (res.ok) {
                setSuccess(true);
                setEmail('');
            } else {
                setError(data?.error?.message || 'Something went wrong');
            }
        } catch (err: any) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex flex-col justify-center items-center p-4'>
            <ForgetPw />
            {success ? (
                <Card className='max-w-md sm:max-w-xl sm:p-8 w-full text-center'>
                    We've sent you a email with a button "Reset" click on it and you'll redirect to the reset page!
                    <Button variant="link">
                        <Link href={'/auth/login/forgot-password'}>
                            Back
                        </Link>    
                    </Button> 
                </Card>
            ) : (
                <Card className='max-w-md sm:max-w-xl sm:p-8 w-full'>
                    <CardHeader className='text-center flex flex-col items-center mt-1'>
                        <CardTitle className='text-lg xs:text-2xl sm:text-3xl mb-4'>Welcome to password reset page!</CardTitle>
                        <CardDescription className='w-80'>
                            We'll send an email to the address you enter so you can reset your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className='flex gap-4 my-4' onSubmit={handleSend}>
                            <Input type='email' placeholder='Enter your email...' name='email' value={email} onChange={e => setEmail(e.target.value)} required />
                            <Button type='submit' disabled={loading} className='cursor-pointer'>
                                <Send className={loading ? 'animate-spin' : ''} />
                            </Button>
                        </form>
                        {error && <p className='text-red-600 mt-2 text-center'>{error}</p>}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
