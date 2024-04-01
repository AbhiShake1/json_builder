"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { IconArrowBack } from "@tabler/icons-react"
import React from "react";

export function BackButton({ children }: React.PropsWithChildren) {
    const router = useRouter()

    return <Button variant="link" className="font-bold text-sm flex flex-row dark:text-white text-black items-center space-x-2" onClick={() => router.back()}>
        <IconArrowBack />
        {children}
    </Button>
}