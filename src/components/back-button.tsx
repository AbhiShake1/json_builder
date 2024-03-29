"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { IconArrowBack } from "@tabler/icons-react"
import React from "react";

export function BackButton({ children }: React.PropsWithChildren) {
    const router = useRouter()

    return <Button variant="link" className="font-bold items-start text-sm flex flex-row space-x-1 dark:text-white text-black" onClick={() => router.back()}>
        <IconArrowBack />
        {children}
    </Button>
}