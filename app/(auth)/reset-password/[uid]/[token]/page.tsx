"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from "next/navigation"
import { TrendingUp, Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { toast } from "sonner"
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

const ResetPasswordPage = () => {
    const router = useRouter()
    const params = useParams()
    const { uid, token } = params

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Validation
        if (!formData.newPassword || !formData.confirmPassword) {
            toast.error("Please fill in all fields")
            return
        }

        if (formData.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters")
            return
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('http://192.168.1.28:8000/api/auth/reset-password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: uid,
                    token: token,
                    new_password: formData.newPassword
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setIsSuccess(true)
                toast.success("Password reset successful!")
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            } else {
                let errorMsg = "Failed to reset password"
                
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
                
                toast.error(errorMsg)
            }
        } catch (error: any) {
            console.error("Reset password error:", error)
            toast.error("Network error. Please try again.")
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
                        {isSuccess ? "Password Reset Complete" : "Reset Your Password"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isSuccess 
                            ? "You can now login with your new password"
                            : "Enter your new password below"
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
                                Your password has been successfully reset. Redirecting to login...
                            </p>
                            <Button 
                                onClick={() => router.push("/login")} 
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                                Go to Login
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        disabled={isLoading}
                                        className="pl-10"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Must be at least 8 characters
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        disabled={isLoading}
                                        className="pl-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
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
                                        Resetting Password...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Reset Password
                                    </>
                                )}
                            </Button>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>
                            Remember your password?{" "}
                            <Link
                                href="/login"
                                className="text-emerald-500 hover:underline font-medium"
                            >
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ResetPasswordPage