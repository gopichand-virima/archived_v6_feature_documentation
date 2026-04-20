# Script to rename all image files to follow naming convention:
# - Lowercase letters only
# - Underscores instead of spaces and hyphens
# - Lowercase file extensions

$imagesRoot = "src\assets\images"
$renameLog = @()

function NormalizeFileName {
    param([string]$fileName)
    
    # Get extension and convert to lowercase
    $extension = [System.IO.Path]::GetExtension($fileName).ToLower()
    $nameWithoutExt = [System.IO.Path]::GetFileNameWithoutExtension($fileName)
    
    # Convert to lowercase
    $normalized = $nameWithoutExt.ToLower()
    
    # Replace spaces and hyphens with underscores
    $normalized = $normalized -replace '\s+', '_'
    $normalized = $normalized -replace '-', '_'
    
    # Remove multiple consecutive underscores
    $normalized = $normalized -replace '_+', '_'
    
    # Remove leading/trailing underscores
    $normalized = $normalized.Trim('_')
    
    return "${normalized}${extension}"
}

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

# Get all image files
$imageFiles = Get-ChildItem -Path $imagesRoot -Recurse -File -Include *.png,*.PNG,*.jpg,*.JPG,*.jpeg,*.JPEG,*.gif,*.GIF,*.svg,*.SVG

Write-Host "Found $($imageFiles.Count) image files to process..." -ForegroundColor Cyan

foreach ($file in $imageFiles) {
    $oldName = $file.Name
    $newName = NormalizeFileName $oldName
    $oldFullPath = $file.FullName
    $newFullPath = Join-Path $file.DirectoryName $newName
    
    # Only rename if name changed
    if ($oldName -ne $newName) {
        try {
            # Check if target already exists
            if (Test-Path $newFullPath) {
                Write-Host "SKIP: Target exists - $newName" -ForegroundColor Yellow
                $renameLog += [PSCustomObject]@{
                    OldPath = $oldFullPath
                    NewPath = $newFullPath
                    Status = "SKIPPED (target exists)"
                }
            } else {
                Rename-Item -Path $oldFullPath -NewName $newName -ErrorAction Stop
                Write-Host "RENAMED: $oldName -> $newName" -ForegroundColor Green
                $renameLog += [PSCustomObject]@{
                    OldPath = $oldFullPath
                    NewPath = $newFullPath
                    Status = "RENAMED"
                }
            }
        } catch {
            Write-Host "ERROR renaming $oldName : $_" -ForegroundColor Red
            $renameLog += [PSCustomObject]@{
                OldPath = $oldFullPath
                NewPath = $newFullPath
                Status = "ERROR: $_"
            }
        }
    }
}

# Normalize folder names
$folders = Get-ChildItem -Path $imagesRoot -Recurse -Directory | Sort-Object FullName -Descending

Write-Host "`nProcessing folders..." -ForegroundColor Cyan

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
                $renameLog += [PSCustomObject]@{
                    OldPath = $oldFullPath
                    NewPath = $newFullPath
                    Status = "SKIPPED (target exists)"
                }
            } else {
                Rename-Item -Path $oldFullPath -NewName $newName -ErrorAction Stop
                Write-Host "RENAMED FOLDER: $oldName -> $newName" -ForegroundColor Green
                $renameLog += [PSCustomObject]@{
                    OldPath = $oldFullPath
                    NewPath = $newFullPath
                    Status = "RENAMED"
                }
            }
        } catch {
            Write-Host "ERROR renaming folder $oldName : $_" -ForegroundColor Red
            $renameLog += [PSCustomObject]@{
                OldPath = $oldFullPath
                NewPath = $newFullPath
                Status = "ERROR: $_"
            }
        }
    }
}

# Save rename log
$logPath = "scripts\image-rename-log.csv"
$renameLog | Export-Csv -Path $logPath -NoTypeInformation
Write-Host "`nRename log saved to: $logPath" -ForegroundColor Cyan
Write-Host "Total items processed: $($renameLog.Count)" -ForegroundColor Cyan

