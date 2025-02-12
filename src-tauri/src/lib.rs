#[tauri::command]
fn get_current_user_root_dir() -> String {
    let home = dirs::home_dir().unwrap();
    home.to_string_lossy().to_string()
}

#[derive(serde::Serialize)]
struct FileObject {
    name: String,
    ext: String,
    is_dir: bool,
    size: u64,
    path: String,
    dir_path: String,
    last_modified: String,
    created: String,
}

#[tauri::command]
fn list_folders_files(path: &str) -> Vec<FileObject> {
    let path = std::path::Path::new(path);
    let mut files = vec![];

    for entry in std::fs::read_dir(path).unwrap() {
        let entry = entry.unwrap();
        let metadata = entry.metadata().unwrap();
        let file_type = metadata.file_type();
        let is_dir = file_type.is_dir();
        let file_name = entry.file_name();
        let file_name = file_name.to_string_lossy().to_string();
        let path = entry.path().to_string_lossy().to_string();
        // The path but minus the file name
        let dir_path = path
            .split('/')
            .take_while(|s| s != &file_name)
            .collect::<Vec<&str>>()
            .join("/");

        let ext = if is_dir {
            "".to_string()
        } else {
            match std::path::Path::new(&file_name).extension() {
                Some(ext) => ext.to_string_lossy().to_string(),
                None => "".to_string(),
            }
        };
        let size = metadata.len();
        let last_modified = metadata.modified().unwrap();
        let last_modified = last_modified
            .duration_since(std::time::SystemTime::UNIX_EPOCH)
            .unwrap();
        let last_modified = chrono::DateTime::from_timestamp(last_modified.as_secs() as i64, 0)
            .unwrap()
            .naive_local();

        let last_modified = last_modified.format("%Y-%m-%d %H:%M:%S").to_string();
        let created = metadata.created().unwrap();
        let created = created
            .duration_since(std::time::SystemTime::UNIX_EPOCH)
            .unwrap();
        let created = chrono::DateTime::from_timestamp(created.as_secs() as i64, 0)
            .unwrap()
            .naive_local();
        let created = created.format("%Y-%m-%d %H:%M:%S").to_string();

        files.push(FileObject {
            name: file_name,
            ext,
            is_dir,
            size,
            path,
            dir_path,
            last_modified,
            created,
        });
    }

    files
}

#[tauri::command]
fn open_file(path: &str) {
    let path = std::path::Path::new(path);
    let _ = open::that(path);
}

#[tauri::command]
fn delete_object(path: &str) {
    let path = std::path::Path::new(path);
    if path.is_dir() {
        std::fs::remove_dir_all(path).unwrap();
    } else {
        std::fs::remove_file(path).unwrap();
    }
}

#[tauri::command]
fn build_breadcrumbs(path: &str) -> Vec<String> {
    let mut breadcrumbs = vec![];
    let mut path = std::path::Path::new(path);

    while let Some(parent) = path.parent() {
        breadcrumbs.push(parent.to_string_lossy().to_string());
        path = parent;
    }

    breadcrumbs.reverse();
    breadcrumbs
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_current_user_root_dir,
            list_folders_files,
            open_file,
            delete_object,
            build_breadcrumbs
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
