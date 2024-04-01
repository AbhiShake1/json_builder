"use client"

import {type PropsWithChildren} from "react";
import {useSchemaStore} from "~/stores/schema";
import {Button} from "~/components/ui/button";
import {CopyIcon} from "@radix-ui/react-icons";
import {toast} from "sonner";

export function FlutterOutputShell({children, componentId}: PropsWithChildren & { componentId: number }) {
    return children
}
