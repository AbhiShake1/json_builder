import { Activity } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { api } from "~/trpc/server"
import { AddOrganizationButton } from "./_components/add-organization-button"

export default async function Page({ searchParams: { q: search } }: { searchParams: { q: string } }) {
  const organizations = await api.organization.getAll({ search })

  return <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
    <div className="flex flex-row">
      <h1 className="text-lg font-semibold md:text-2xl">Organizations</h1>
			<div className="w-full"/>
      <AddOrganizationButton />
    </div>
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {
        organizations.map(({ id, name }) => {
          return <Link href={`/app/organizations/${id}/projects/`} key={id}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{name}</div>
              </CardContent>
            </Card>
          </Link>
        })
      }
    </div>
  </main>
}
