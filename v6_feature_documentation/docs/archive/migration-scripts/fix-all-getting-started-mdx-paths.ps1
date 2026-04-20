# Script to fix all getting_started MDX image paths for all versions
# Ensures all paths use lowercase with underscores

$contentRoot = "src\content"
$versions = @("NG", "6_1_1", "5_13")

# File name mappings (old -> new)
$fileMappings = @{
    "User Authentication_9.png" = "user_authentication_9.png"
    "User Authentication_8.png" = "user_authentication_8.png"
    "User Authentication_7.png" = "user_authentication_7.png"
    "User Authentication_6.png" = "user_authentication_6.png"
    "User Authentication_5.png" = "user_authentication_5.png"
    "User Authentication_4.png" = "user_authentication_4.png"
    "User Authentication_3.png" = "user_authentication_3.png"
    "User Authentication_2.png" = "user_authentication_2.png"
    "User Authentication_1.png" = "user_authentication_1.png"
    "User Authentication.png" = "user_authentication.png"
    "Configure Branding.png" = "configure_branding.png"
    "Organization Details.png" = "organization_details.png"
    "Configure SSO and Authentication.png" = "configure_sso_and_authentication.png"
    "Configure SSO and Authentication_1.png" = "configure_sso_and_authentication_1.png"
    "Configure SSO and Authentication_2.png" = "configure_sso_and_authentication_2.png"
    "Configure SSO and Authentication_3.png" = "configure_sso_and_authentication_3.png"
    "Configure SSO and Authentication_4.png" = "configure_sso_and_authentication_4.png"
    "Configure SSO and Authentication_5.png" = "configure_sso_and_authentication_5.png"
    "Configure SSO and Authentication_6.png" = "configure_sso_and_authentication_6.png"
    "Configure SSO and Authentication_7.png" = "configure_sso_and_authentication_7.png"
    "User Management_1.png" = "user_management_1.png"
    "User Management_1_1.png" = "user_management_1_1.png"
    "User Management_1_2.png" = "user_management_1_2.png"
    "User Management_1_3.png" = "user_management_1_3.png"
    "User Management_1_4.png" = "user_management_1_4.png"
    "User Management_1_5.png" = "user_management_1_5.png"
    "User Management_1_6.png" = "user_management_1_6.png"
    "User Management_1_7.png" = "user_management_1_7.png"
    "User Management_1_8.png" = "user_management_1_8.png"
    "Update User Settings.png" = "update_user_settings.png"
    "Update User Settings_1.png" = "update_user_settings_1.png"
}

# Folder name mappings
$folderMappings = @{
    "Authentcation" = "authentication"
    "Authentication" = "authentication"
    "Branding" = "branding"
    "Organization_Details" = "organization_details"
    "SSO_and_Authentication" = "sso_and_authentication"
    "User_Management" = "user_management"
    "User_Settings" = "user_settings"
}

foreach ($version in $versions) {
    $versionPath = Join-Path $contentRoot $version
    $gettingStartedPath = Join-Path $versionPath "getting_started_$version"
    
    if (-not (Test-Path $gettingStartedPath)) {
        Write-Host "Skipping $version - getting_started folder not found" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "`nProcessing MDX files for version: $version" -ForegroundColor Cyan
    
    $mdxFiles = Get-ChildItem -Path $gettingStartedPath -Filter "*.mdx"
    
    foreach ($file in $mdxFiles) {
        $content = Get-Content -Path $file.FullName -Raw
        $originalContent = $content
        $fileUpdated = $false
        
        # Fix duplicate .png).png) issue
        if ($content -match '\.png\)\.png\)') {
            $content = $content -replace '\.png\)\.png\)', '.png)'
            $fileUpdated = $true
        }
        
        # Update folder names in paths
        foreach ($mapping in $folderMappings.GetEnumerator()) {
            $pattern = "/$($mapping.Key)/"
            $replacement = "/$($mapping.Value)/"
            if ($content -match [regex]::Escape($pattern)) {
                $content = $content -replace [regex]::Escape($pattern), $replacement
                $fileUpdated = $true
            }
        }
        
        # Update file names in paths
        foreach ($mapping in $fileMappings.GetEnumerator()) {
            if ($content -match [regex]::Escape($mapping.Key)) {
                $content = $content -replace [regex]::Escape($mapping.Key), $mapping.Value
                $fileUpdated = $true
            }
        }
        
        if ($fileUpdated) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "  UPDATED: $($file.Name)" -ForegroundColor Green
        }
    }
}

Write-Host "`nComplete!" -ForegroundColor Cyan

