"use client"
import React from 'react'
import Link from 'next/link'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CloudCog, LogOut, TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/authstore';
import { Eye, EyeOff, LogIn } from "lucide-react";
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
import { authApi } from '@/lib/api/auth';
import { log } from 'console';
const page = () => {

    const router = useRouter();
    const { register, isLoading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        first_name:"",
        email: "",
        password: "",
        last_name:"",
        company_info: {}
    });

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!formData.email || !formData.password || !formData.last_name  || !formData.first_name) {
//             toast.error("Please fill in all fields");
//             return;
//         }
    
        
//         try {
//           const response =   await register(formData);
//  console.log("✅ Registration successful:", response);
//     toast.success("Registration successful! Please verify your email.");
        
//           const useruuid = response.data?.user?.uuid
//           if (useruuid) {
        
//               toast.success("Register successful! Sending the verification code");
//               await authApi.sendEmailOTP(useruuid)
//               router.push(`/verify-email?uuid=${useruuid}`);
//           }else{
//             toast.error("Registration successful but UUID not found");
//       router.push("/register");
//           }
//         } catch (error: any) {
//             const errorMessage = 
//       error?.response?.data?.message ||
//       error?.response?.data?.detail ||
//       error?.message ||
//       "Registration failed. Please try again.";
    
//     toast.error(errorMessage);
//         }
//     };


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.last_name || !formData.first_name) {
        toast.error("Please fill in all fields");
        return;
    }

    try {
        const response = await register(formData);
        

        if (response.data?.user?.is_verified) {
            toast.info("This email is already verified. Please log in.");
            router.push("/login");
            return; 
        }


        const useruuid = response.data?.user?.uuid;
        
        if (useruuid) {
            toast.success("Registration successful! Sending the verification code.");
            await authApi.sendEmailOTP(useruuid);
            router.push(`/verify-email?uuid=${useruuid}`);
        } else {
            toast.error("Registration successful but UUID not found");
            router.push("/register");
        }
    } catch (error: any) {
        const errorMessage = 
            error?.response?.data?.message ||
            error?.response?.data?.detail ||
            error?.message ||
            "Registration failed. Please try again.";
        
        toast.error(errorMessage);
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
                        Create an Account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Sign up to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                                                <div className="space-y-2">
                            <Label htmlFor="email">First Name</Label>
                            <Input
                                id="firstname"
                                type="text"
                                placeholder="Enter your first name"
                                value={formData.first_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, first_name: e.target.value })
                                }
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>
                                                                        <div className="space-y-2">
                            <Label htmlFor="email">Last Name</Label>
                            <Input
                                id="lastname"
                                type="text"
                                placeholder="Enter your last name"
                                value={formData.last_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, last_name: e.target.value })
                                }
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@example.com"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
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


                        <Button type="submit" className="hover:text-lg text-emerald-500  cursor-pointer w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                    Signing Up...
                                </>
                            ) : (
                                <>
                                 Next

                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm  text-muted-foreground">
                        <p className=''>
                            Already have an account?{" "}
                            <Link
                                href={"/login"}
                                className="text-emerald-500 hover:underline font-medium "
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

}

export default page
