# Script to update MDX file references to match renamed image files

$contentRoot = "src\content"
$renameLog = Import-Csv "scripts\image-rename-log.csv"

# Create a mapping of old paths to new paths
$pathMappings = @{}

foreach ($entry in $renameLog) {
    if ($entry.Status -eq "RENAMED") {
        $oldPath = $entry.OldPath
        $newPath = $entry.NewPath
        
        # Convert absolute paths to relative paths from images root
        $oldRelative = $oldPath -replace '.*\\src\\assets\\images\\', ''
        $newRelative = $newPath -replace '.*\\src\\assets\\images\\', ''
        
        # Normalize path separators for URL format
        $oldUrl = $oldRelative -replace '\\', '/'
        $newUrl = $newRelative -replace '\\', '/'
        
        # Create mappings for different path formats
        $pathMappings["/assets/images/$oldUrl"] = "/assets/images/$newUrl"
        $pathMappings["assets/images/$oldUrl"] = "assets/images/$newUrl"
        
        # Also map just the filename
        $oldFileName = Split-Path -Leaf $oldPath
        $newFileName = Split-Path -Leaf $newPath
        $pathMappings[$oldFileName] = $newFileName
    }
}

# Also add folder name mappings
$folderMappings = @{
    "Authentication" = "authentication"
    "Branding" = "branding"
    "Organization_Details" = "organization_details"
    "SSO_and_Authentication" = "sso_and_authentication"
    "User_Management" = "user_management"
    "User_Settings" = "user_settings"
    "Authentcation" = "authentication"  # Typo in some paths
}

# Get all MDX files
$mdxFiles = Get-ChildItem -Path $contentRoot -Recurse -Filter "*.mdx"

Write-Host "Found $($mdxFiles.Count) MDX files to process..." -ForegroundColor Cyan

$updateCount = 0

foreach ($file in $mdxFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    $fileUpdated = $false
    
    # Update file name references
    foreach ($mapping in $pathMappings.GetEnumerator()) {
        if ($content -match [regex]::Escape($mapping.Key)) {
            $content = $content -replace [regex]::Escape($mapping.Key), $mapping.Value
            $fileUpdated = $true
        }
    }
    
    # Update folder name references
    foreach ($mapping in $folderMappings.GetEnumerator()) {
        # Match folder names in paths
        $pattern = [regex]::Escape($mapping.Key)
        if ($content -match $pattern) {
            # Replace in path context (between slashes or at start/end)
            $content = $content -replace "([/\\])$pattern([/\\])", "`$1$($mapping.Value)`$2"
            $content = $content -replace "([/\\])$pattern`"", "`$1$($mapping.Value)`""
            $content = $content -replace "([/\\])$pattern\)", "`$1$($mapping.Value))"
            $fileUpdated = $true
        }
    }
    
    if ($fileUpdated) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "UPDATED: $($file.FullName)" -ForegroundColor Green
        $updateCount++
    }
}

Write-Host "`nUpdated $updateCount MDX files" -ForegroundColor Cyan

