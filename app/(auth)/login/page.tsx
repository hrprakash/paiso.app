"use client"
import React from 'react'
import Link from 'next/link'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LassoSelect, TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/authstore';
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,

} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
const page = () => {

    const router = useRouter();
    const { login, isLoading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
        toast.error("Please fill in all fields");
        return;
    }

    try {
        const res = await login(formData);
        
        if (res?.data?.user) {
            toast.success("Login successful!");
            router.push("/dashboard");
        }
    } catch (error: any) {
        // Wrap in try-catch to prevent secondary errors
        try {
            const message = error?.message || "Invalid credentials. Please try again.";
            toast.error(message);
        } catch (toastError) {
            console.error("Toast error:", toastError);
            // Fallback if even toast fails
            alert("Login failed. Please try again.");
        }
    }
};
    return (
        <div className='min-h-screen flex flex-col items-center justify-center p-4 '>

            <Link href={"/home"} className='flex gap-2 mb-6'>
                <TrendingUp className='w-8 h-8 text-emerald-500' />
                <span className='cursor-pointer text-3xl font-semibold text-gray-900 dark:text-white'>Paiso</span>
            </Link>

            <Card className="shadow-2xl dark:shadow-white/25  w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-center">
                        Sign in to your account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form  onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                // 🚀 FIXED id to 'email'
                                id="username"
                                // 🚀 FIXED type to 'email'
                                type="email"
                                placeholder="Enter your email"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href={"/forget-password"}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type='submit' className="w-full cursor-pointer text-emerald-500 hover:text-lg" disabled={isLoading}>
                            {isLoading ? (
                                <div className='flex items-center justify-center gap-4'>
                                <Loader2 className='animate-spin'/>    Signing in...
                                </div>
                            ) : (
                                <div className='flex items-center justify-center'>
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Sign In
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>
                            Don't have an account?{" "}
                            <Link
                                href={"/register"}
                                className=" text-emerald-500 hover:underline font-medium"
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

export default page
