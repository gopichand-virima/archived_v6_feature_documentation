# Script to rename folders to lowercase with underscores

$imagesRoot = "src\assets\images"

function NormalizeFolderName {
    param([string]$folderName)
    
    # Convert to lowercase
    $normalized = $folderName.ToLower()
    
    # Replace spaces and hyphens with underscores
    $normalized = $normalized -replace '\s+', '_'
    $normalized = $normalized -replace '-', '_'
    
    # Remove multiple consecutive underscores
    $normalized = $normalized -replace '_+', '_'
    
    # Remove leading/trailing underscores
    $normalized = $normalized.Trim('_')
    
    return $normalized
}

# Get all folders, sorted by depth (deepest first) to avoid path conflicts
$folders = Get-ChildItem -Path $imagesRoot -Recurse -Directory | 
    Sort-Object { $_.FullName.Split('\').Count } -Descending

Write-Host "Found $($folders.Count) folders to process..." -ForegroundColor Cyan

foreach ($folder in $folders) {
    $oldName = $folder.Name
    $newName = NormalizeFolderName $oldName
    $oldFullPath = $folder.FullName
    $parentPath = $folder.Parent.FullName
    $newFullPath = Join-Path $parentPath $newName
    
    # Only rename if name changed
    if ($oldName -ne $newName) {
        try {
            # Check if target already exists
            if (Test-Path $newFullPath) {
                Write-Host "SKIP: Target folder exists - $newName" -ForegroundColor Yellow
            } else {
                Rename-Item -Path $oldFullPath -NewName $newName -ErrorAction Stop
                Write-Host "RENAMED FOLDER: $oldName -> $newName" -ForegroundColor Green
            }
        } catch {
            Write-Host "ERROR renaming folder $oldName : $_" -ForegroundColor Red
        }
    }
}

Write-Host "`nFolder renaming complete!" -ForegroundColor Cyan

