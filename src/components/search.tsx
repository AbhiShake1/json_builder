import {Input, type InputProps} from "~/components/ui/input";
import {IconSearch} from "@tabler/icons-react";
import {cn} from "~/lib/utils";

export function Search({className, ...rest}: Omit<InputProps, "type">) {
    return <div className="relative">
        <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
        <Input
            type="search"
            className={cn(className, "pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]")}
            {...rest}
        />
    </div>
}