import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query"
import { invoke } from "@tauri-apps/api/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Folder, Pencil, RefreshCw, Trash } from "lucide-react"
import { GetCurrentPath, GetPreviousPath, UpdateCurrentPath, UpdatePreviousPath } from '@/lib/local_storage'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { ask } from "@tauri-apps/plugin-dialog"
import IconProvider from '@/components/IconProvider'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

export interface FileObject {
  name: string
  ext: string
  is_dir: boolean
  size: number
  path: string
  dir_path: string
  last_modified: string
  created: string
}

async function list_folders_files(path: string): Promise<FileObject[]> {
  return await invoke("list_folders_files", { path }) as FileObject[]
}

async function build_breadcrumbs(path: string): Promise<string[]> {
  return await invoke("build_breadcrumbs", { path }) as string[]
}

function RouteComponent() {


  const { data: objects, isLoading: loading, isFetching, isRefetching, error, refetch } = useQuery({
    queryKey: ["list_folders_files", GetCurrentPath()],
    queryFn: async () => {

      if (!GetCurrentPath()) {
        console.warn("No current folder path")
        return []
      }

      console.log(await build_breadcrumbs(GetCurrentPath() || ""))



      console.info(`Listing folders and files in ${GetCurrentPath() || "Unknown path"}`)
      return list_folders_files(GetCurrentPath() || "");
    },

  })

  if (loading) {
    return (
      <>
        Loading...
      </>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error.message}</div>
      </div>
    )
  }

  if (!objects) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">No files or folders found</div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex justify-end items-center mb-4 sticky top-0  w-full z-10 bg-transparent backdrop-blur-lg ">
        <div className='flex gap-2 justify-end mt-1'>
          <Button variant="ghost"
            onClick={() => {
              if (!GetPreviousPath()) return;
              UpdateCurrentPath(GetPreviousPath() || "")
              refetch()
            }}

            size="icon">
            <ArrowLeft />
          </Button>
          <Button variant="ghost"
            size="icon">
            <ArrowRight />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching || loading || isRefetching}
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {objects.map((object) => (
          <ContextMenu key={object.path}>
            <ContextMenuTrigger asChild>
              <Card
                key={object.path}
                className='group transition-colors hover:bg-muted/50'
                onClick={async () => {
                  if (!object.is_dir) {
                    return await invoke("open_file", { path: object.path })
                  }

                  console.log(`Navigating to ${object.path}`)

                  const previous_path = GetCurrentPath()
                  UpdatePreviousPath(previous_path || "")

                  UpdateCurrentPath(object.path)
                  refetch()
                }}
              >
                <CardContent className='p-0'>
                  <Button asChild variant='ghost' className='h-auto w-full justify-start p-4'>
                    <a>
                      <div className='shrink-0'>
                        {object.is_dir ? (
                          <Folder size={24} />
                        ) : (
                          <></>
                        )}

                        {!object.is_dir ? (
                          <IconProvider ext={object.ext} />
                        ) : (
                          <></>
                        )}
                      </div>
                      <span className='truncate text-sm font-medium ml-2'>{object.name}</span>
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem variant="destructive" onClick={async () => {

                console.log("Clicked delete")
                const answer = await ask('This action cannot be reverted. Are you sure?', {
                  title: 'Delete Confirmation',
                  kind: 'warning',
                });

                if (answer) {
                  console.log(`Deleting ${object.path}`)
                  await invoke("delete_object", { path: object.path })
                  UpdateCurrentPath(object.dir_path)
                  refetch()
                }

              }}><Trash /> Delete {object.is_dir ? "Folder" : "File"}</ContextMenuItem>
              <ContextMenuItem>

                <Pencil /> Rename {object.is_dir ? "Folder" : "File"}
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
    </div>
  )
}
