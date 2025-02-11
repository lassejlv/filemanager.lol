import { useQuery } from "@tanstack/react-query"
import { invoke } from "@tauri-apps/api/core"
import { Card, CardContent } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { File, Folder, RefreshCw } from "lucide-react"
import { useAtom } from "jotai"
import { CurrentFolderPath } from "./stores"

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

export default function App() {
  const [currentFolderPath, updateCurrentFolderPath] = useAtom(CurrentFolderPath)

  const { data: objects, isLoading: loading, error, refetch } = useQuery({
    queryKey: ["list_folders_files", currentFolderPath],
    queryFn: async () => {
      console.log("Running query with path: ", currentFolderPath)
      const root_folder = await invoke("get_current_user_root_dir") as string;
      if (!currentFolderPath) {
        updateCurrentFolderPath(root_folder)
        return await list_folders_files(root_folder);
      }
      return await list_folders_files(currentFolderPath);
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">File Manager</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => refetch()}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {objects.map((object) => (
          <Card
            key={object.path}
            className='group transition-colors hover:bg-muted/50'
            onClick={async () => {
              if (!object.is_dir) {
                return await invoke("open_file", { path: object.path })
              }
              updateCurrentFolderPath(object.dir_path)
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
                      <File size={24} />
                    )}
                  </div>
                  <span className='truncate text-sm font-medium ml-2'>{object.name}</span>
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
