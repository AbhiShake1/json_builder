"use client"

import {Button} from "~/components/ui/button"
import React from "react";
import {BackButton} from "~/components/back-button";
import {signIn} from "next-auth/react";

export function LoginForm() {
    return (
        <div className="flex flex-col h-screen">
            <header className="flex items-center justify-start p-4">
                <BackButton>
                    <h1>Back to Home</h1>
                </BackButton>
            </header>
            <main className="flex flex-1 items-center justify-center">
                <div className="w-[400px] space-y-4">
                    <Button className="w-full" onClick={() => signIn("github")}>
                        <GithubIcon className="mr-2 h-4 w-4"/>
                        Login with GitHub
                    </Button>
                </div>
            </main>
            <footer className="flex items-center justify-center p-4">
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">Copyright © 2023. All rights
                    reserved.</p>
            </footer>
        </div>
    )
}


function GithubIcon(props: { className: string }) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path
                d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
            <path d="M9 18c-4.51 2-5-2-7-2"/>
        </svg>
    )
}
