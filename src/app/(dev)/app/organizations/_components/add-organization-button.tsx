import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/server";

async function addOrganization(formData: FormData) {
  "use server"

  const name = formData.get("name") as string

  await api.organization.create({ name })
  revalidatePath('/app/organizations')
  redirect('/app/organizations')
}

export function AddOrganizationButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-sm font-semibold">
          Add new organization
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={addOrganization}>
          <DialogHeader>
            <DialogTitle>Add organization</DialogTitle>
            <DialogDescription>
              Click add when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input required id="name" name="name" placeholder="organization name" className="col-span-3" />
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
