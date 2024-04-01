import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {Button} from "~/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "~/components/ui/dialog";
import {Input} from "~/components/ui/input";
import {Label} from "~/components/ui/label";
import {api} from "~/trpc/server";

async function addComponent(projectId: number, orgId: string, formData: FormData) {
    const name = formData.get("name") as string

    await api.project.createComponent({name, projectId})
    const path = `/app/organizations/${orgId}/projects/${projectId}/components/`
    revalidatePath(path)
    redirect(path)
}

export function AddComponentButton({projectId, orgId}: { projectId: number, orgId: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-sm font-semibold">
                    Add new component
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={async (f) => {
                    "use server"

                    await addComponent(projectId, orgId, f)
                }}>
                    <DialogHeader>
                        <DialogTitle>Add component</DialogTitle>
                        <DialogDescription>
                            Click add when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input required id="name" name="name" placeholder="component name"
                                   className="col-span-3"/>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose>
                            <Button type="submit">
                                Add
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
