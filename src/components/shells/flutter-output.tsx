import {Badge} from "~/components/ui/badge";
import {type PropsWithChildren} from "react";

export function FlutterOutputShell({children}: PropsWithChildren) {
    return <div
        className="relative flex h-full min-h-[50vh] flex-col p-4 lg:col-span-2 rounded-lg border border-dashed shadow-sm">
        <Badge variant="outline" className="absolute right-3 top-3">
            Output
        </Badge>
        <div className="flex-1"/>
        {children}
    </div>
}