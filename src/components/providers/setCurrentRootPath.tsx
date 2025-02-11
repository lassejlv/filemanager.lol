import { UpdateCurrentPath } from "@/lib/local_storage";
import { CurrentFolderPath, RootFolderPath } from "@/stores";
import { invoke } from "@tauri-apps/api/core";
import { useAtom } from "jotai";
import { useEffect } from "react";


export default function SetCurrentRootPath() {
  const [, updateCurrentFolderPath] = useAtom(CurrentFolderPath)
  const [, updateRootFolder] = useAtom(RootFolderPath)

  useEffect(() => {
    (async () => {
      const root_folder = await invoke("get_current_user_root_dir") as string;
      updateRootFolder(root_folder)
      updateCurrentFolderPath(root_folder)
      UpdateCurrentPath(root_folder)
    })()
  })

  return <> </>
}
