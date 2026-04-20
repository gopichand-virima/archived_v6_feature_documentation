# Script to fix getting_started image folders and files for all versions
# Applies the same naming convention as 6_1 to NG, 6_1_1, and 5_13

$versions = @("NG", "6_1_1", "5_13")
$basePath = "src\assets\images"

# Folder name mappings (old -> new)
$folderMappings = @{
    "Authentcation" = "authentication"
    "Authentication" = "authentication"
    "Branding" = "branding"
    "Organization_Details" = "organization_details"
    "SSO_and_Authentication" = "sso_and_authentication"
    "User_Management" = "user_management"
    "User_Settings" = "user_settings"
}

function NormalizeFileName {
    param([string]$fileName)
    $extension = [System.IO.Path]::GetExtension($fileName).ToLower()
    $nameWithoutExt = [System.IO.Path]::GetFileNameWithoutExtension($fileName)
    $normalized = $nameWithoutExt.ToLower() -replace '\s+', '_' -replace '-', '_' -replace '_+', '_'
    $normalized = $normalized.Trim('_')
    return "${normalized}${extension}"
}

foreach ($version in $versions) {
    $versionPath = Join-Path $basePath $version
    $gettingStartedPath = Join-Path $versionPath "getting_started_$version"
    
    if (-not (Test-Path $gettingStartedPath)) {
        Write-Host "Skipping $version - getting_started folder not found" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "`nProcessing version: $version" -ForegroundColor Cyan
    
    # Rename folders
    $folders = Get-ChildItem -Path $gettingStartedPath -Directory
    foreach ($folder in $folders) {
        $oldName = $folder.Name
        $newName = $null
        
        # Check if we have a mapping
        if ($folderMappings.ContainsKey($oldName)) {
            $newName = $folderMappings[$oldName]
        } else {
            # Normalize the name
            $newName = $oldName.ToLower() -replace '\s+', '_' -replace '-', '_' -replace '_+', '_'
            $newName = $newName.Trim('_')
        }
        
        if ($oldName -ne $newName) {
            $oldPath = $folder.FullName
            $newPath = Join-Path $folder.Parent.FullName $newName
            
            try {
                if (Test-Path $newPath) {
                    Write-Host "  SKIP folder: $oldName (target exists)" -ForegroundColor Yellow
                } else {
                    Rename-Item -Path $oldPath -NewName $newName -ErrorAction Stop
                    Write-Host "  RENAMED folder: $oldName -> $newName" -ForegroundColor Green
                }
            } catch {
                Write-Host "  ERROR renaming folder $oldName : $_" -ForegroundColor Red
            }
        }
    }
    
    # Rename files in getting_started folders
    $files = Get-ChildItem -Path $gettingStartedPath -Recurse -File -Include *.png,*.PNG,*.jpg,*.JPG,*.jpeg,*.JPEG
    foreach ($file in $files) {
        $oldName = $file.Name
        $newName = NormalizeFileName $oldName
        $oldPath = $file.FullName
        $newPath = Join-Path $file.DirectoryName $newName
        
        if ($oldName -ne $newName) {
            try {
                if (Test-Path $newPath) {
                    Write-Host "  SKIP file: $oldName (target exists)" -ForegroundColor Yellow
                } else {
                    Rename-Item -Path $oldPath -NewName $newName -ErrorAction Stop
                    Write-Host "  RENAMED file: $oldName -> $newName" -ForegroundColor Green
                }
            } catch {
                Write-Host "  ERROR renaming file $oldName : $_" -ForegroundColor Red
            }
        }
    }
}

Write-Host "`nComplete!" -ForegroundColor Cyan

