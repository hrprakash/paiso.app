"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { TrendingUp, Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { toast } from "sonner"
import { authApi } from '@/lib/api/auth' // Import your auth API
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'

const ForgotPasswordPage = () => {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!email) {
            toast.error("Please enter your email address")
            return
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address")
            return
        }

        setIsLoading(true)

        try {
            await authApi.forgotPassword(email)
            setIsSuccess(true)
            toast.success("Password reset email sent!")
        } catch (error: any) {
            console.error("Forgot password error:", error)
            
            // Safe error message extraction
            let errorMsg = "Failed to send reset email"
            
            try {
                if (error?.response?.data) {
                    const data = error.response.data
                    if (data.message) {
                        errorMsg = data.message
                    } else if (data.errors) {
                        const firstError = Object.values(data.errors)[0]
                        errorMsg = Array.isArray(firstError) ? firstError[0] : String(firstError)
                    } else if (data.detail) {
                        errorMsg = data.detail
                    } else if (typeof data === 'string') {
                        errorMsg = data
                    }
                } else if (error?.message) {
                    errorMsg = error.message
                }
            } catch (parseError) {
                console.error("Error parsing error:", parseError)
            }
            
            toast.error(errorMsg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900'>
            <Link href={"/home"} className='flex gap-2 mb-6'>
                <TrendingUp className='w-8 h-8 text-emerald-500' />
                <span className='cursor-pointer text-3xl font-semibold text-gray-900 dark:text-white'>
                    Paiso
                </span>
            </Link>

            <Card className="shadow-2xl dark:shadow-white/25 w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        {isSuccess ? "Check Your Email" : "Forgot Password?"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isSuccess 
                            ? "We've sent password reset instructions to your email"
                            : "Enter your email address and we'll send you a link to reset your password"
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSuccess ? (
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <CheckCircle className="h-16 w-16 text-emerald-500" />
                            </div>
                            <p className="text-center text-sm text-muted-foreground">
                                If an account exists with <strong>{email}</strong>, you will receive 
                                password reset instructions shortly.
                            </p>
                            <div className="space-y-2">
                                <Button 
                                    onClick={() => router.push("/login")} 
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                                >
                                    Return to Login
                                </Button>
                                <Button 
                                    onClick={() => setIsSuccess(false)} 
                                    variant="outline"
                                    className="w-full"
                                >
                                    Send Another Email
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        className="pl-10"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Send Reset Link
                                    </>
                                )}
                            </Button>

                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center text-sm text-emerald-500 hover:underline font-medium"
                                >
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="text-emerald-500 hover:underline font-medium"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ForgotPasswordPage