import {Book, Bot, Code2, LifeBuoy, Settings2, Share, SquareTerminal, SquareUser, Triangle,} from "lucide-react"
import {Button} from "~/components/ui/button"
import {ResizableHandle, ResizablePanel, ResizablePanelGroup,} from "~/components/ui/resizable"
import {Tooltip, TooltipContent, TooltipTrigger,} from "~/components/ui/tooltip"
import {FlutterOutputShell} from "~/components/shells/flutter-output";
import {Search} from "~/components/search";
import {JsonInput} from "~/components/json-input"
import {FlutterOutput} from "~/components/flutter-output"
import {api} from "~/trpc/server";
import {notFound} from "next/navigation";

export default async function Page({params: {componentId: cId}}: { params: { componentId: string } }) {
    const componentId = parseInt(cId)
    const component = await api.component.byId(componentId)

    if (!component) return notFound()

    const {name} = component

    return (
        <div className="grid h-screen w-full pl-[56px]">
            <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
                <div className="border-b p-2">
                    <Button variant="outline" size="icon" aria-label="Home">
                        <Triangle className="size-5 fill-foreground"/>
                    </Button>
                </div>
                <nav className="grid gap-1 p-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg bg-muted"
                                aria-label="Playground"
                            >
                                <SquareTerminal className="size-5"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Playground
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg"
                                aria-label="components"
                            >
                                <Bot className="size-5"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            components
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg"
                                aria-label="API"
                            >
                                <Code2 className="size-5"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            API
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg"
                                aria-label="Documentation"
                            >
                                <Book className="size-5"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Documentation
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg"
                                aria-label="Settings"
                            >
                                <Settings2 className="size-5"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Settings
                        </TooltipContent>
                    </Tooltip>
                </nav>
                <nav className="mt-auto grid gap-1 p-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="mt-auto rounded-lg"
                                aria-label="Help"
                            >
                                <LifeBuoy className="size-5"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Help
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="mt-auto rounded-lg"
                                aria-label="Account"
                            >
                                <SquareUser className="size-5"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Account
                        </TooltipContent>
                    </Tooltip>
                </nav>
            </aside>
            <div className="flex flex-col">
                <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
                    <h1 className="text-xl font-semibold">Playground</h1>
                    <form className="flex-1 sm:flex-initial mx-3">
                        <Search placeholder="Search components..."/>
                    </form>
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto gap-1.5 text-sm"
                    >
                        <Share className="size-3.5"/>
                        Share
                    </Button>
                </header>
                <ResizablePanelGroup direction="horizontal"
                                     className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
                    <ResizablePanel maxSize={80} minSize={30}>
                        <JsonInput componentId={componentId}/>
                    </ResizablePanel>
                    <ResizableHandle withHandle className="opacity-25"/>
                    <ResizablePanel>
                        <FlutterOutputShell componentId={componentId}>
                            <FlutterOutput componentName={name} componentId={componentId}/>
                        </FlutterOutputShell>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    )
}
