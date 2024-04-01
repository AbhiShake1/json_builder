// this is organization detail (also used as project list inside org)
import { Activity } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { api } from "~/trpc/server"
import { AddProjectButton } from "~/app/(dev)/app/organizations/[orgId]/projects/_components/add-project-button";
import { BackButton } from "~/components/back-button";

export default async function Page({ searchParams: { q: search }, params: { orgId } }: {
  searchParams: { q: string },
  params: { orgId: string }
}) {
  const organizationId = parseInt(orgId)
  const projects = await api.project.forOrganization(organizationId)

  return <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
    <div className="flex flex-row">
      <BackButton>
        <h1 className="text-lg font-semibold md:text-2xl">Projects</h1>
      </BackButton>
      <div className="w-full" />
      <AddProjectButton organizationId={organizationId} />
    </div>
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {
        projects.map(({ id, name }) => {
          return <Link href={`/app/organizations/${orgId}/projects/${id}/components/`} key={id}>
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

