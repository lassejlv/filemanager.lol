// Current path is used to keep track of the current path the user is in
export const GetCurrentPath = () => localStorage.getItem('current_path')
export const UpdateCurrentPath = (path: string) => localStorage.setItem('current_path', path)

// Previous path is used to go back to the previous path when the user clicks the back button
export const GetPreviousPath = () => localStorage.getItem('previous_path')
export const UpdatePreviousPath = (path: string) => localStorage.setItem('previous_path', path)

export const GetCurrentBreadcrumb = () => localStorage.getItem('current_breadcrumb')
export const UpdateCurrentBreadcrumb = (paths: string[]) => localStorage.setItem('current_breadcrumb', JSON.stringify(paths))

export const GetPreviousPathsHistory = () => JSON.parse(localStorage.getItem('previous_paths') || '[]')
export const AddNewPreviousPath = (path: string) => localStorage.setItem('previous_paths', JSON.stringify([...GetPreviousPathsHistory(), path]))
export const RemovePreviousPath = (path: string) =>
  localStorage.setItem('previous_paths', JSON.stringify(GetPreviousPathsHistory().filter((p: string) => p !== path)))
