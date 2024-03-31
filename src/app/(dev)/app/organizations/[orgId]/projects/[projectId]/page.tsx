// this is organization detail (also used as project list inside org)
export default async function Page({ params: { projectId } }: { params: { projectId: string } }) {
  return <div className="h-screen w-screen bg-red-900">{projectId}</div>
}
