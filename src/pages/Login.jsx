import React from "react";

const Login = () => {
    return (
        <div className="w-screen min-h-screen absolute pt-44 top-0 left-0 right-0 bg-[#FFFBF2]">
            <div className="w-full mx-auto max-w-md  rounded-[20px] bg-[#FFF2D6]">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-Logo w-64 h-32 bg-contain bg-no-repeat bg-center"></div>
                    <p className="text-gray-600 text-center">
                        Welcome to our login page<br />
                        coffee shop website
                    </p>
                </div>
                <div className="bg-[#D9BB7A] rounded-t-[60px] rounded-b-[20px] p-8">
                <h2 className="text-2xl font-semibold">Login</h2>
                    <form className="space-y-4">
                    <div>
                        <label className="block text-sm mb-2">Email address</label>
                        <input 
                            type="email" 
                            className="w-full p-3 rounded-lg bg-white"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-3 rounded-lg bg-white"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input 
                                type="checkbox" 
                                id="remember" 
                                className="mr-2"
                            />
                            <label htmlFor="remember" className="text-sm">Remember me</label>
                        </div>
                        <a href="#" className="text-purple-600 text-sm">Forgot password</a>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-[#E8C98B] py-3 rounded-lg text-black hover:bg-[#d4b87c] transition-colors"
                    >
                        Sign In
                    </button>

                    <button 
                        type="button" 
                        className="w-full bg-white py-3 rounded-lg text-black border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <div className="bg-GoogleIcon w-5 h-5 bg-contain bg-no-repeat bg-center"></div>
                        Sign in with Google
                    </button>
                </form>
                </div>
            </div>

        </div>
    );
}

export default Login;