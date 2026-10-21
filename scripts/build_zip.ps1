$root = (Get-Item -Path $PSScriptRoot).Parent.FullName
$destParent = Join-Path (Split-Path $root -Parent) "pesc-platform-hostinger.zip"
$destLocal = Join-Path $root "pesc-platform-hostinger.zip"

Write-Host "Creating deployment ZIP from: $root"

# Remove existing zip files first
if (Test-Path $destParent) { Remove-Item -Force $destParent }
if (Test-Path $destLocal) { Remove-Item -Force $destLocal }

# Create temporary staging directory
$stageDir = Join-Path $env:TEMP ("pesc_deploy_" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $stageDir -Force | Out-Null

$exclude = @('.git', 'node_modules', 'cloudflared.exe', 'pesc-platform-hostinger.zip', 'pesc-platform.zip', '.system_generated')

Get-ChildItem -Path $root -Force | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination (Join-Path $stageDir $_.Name) -Recurse -Force
}

# Create Zip archive using System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($stageDir, $destParent, [System.IO.Compression.CompressionLevel]::Optimal, $false)

# Also copy to local root for convenience
Copy-Item -Path $destParent -Destination $destLocal -Force

# Clean up staging directory
Remove-Item -Path $stageDir -Recurse -Force

Write-Host "Successfully generated deployable ZIP files:"
Write-Host "1) $destParent ($( (Get-Item $destParent).Length ) bytes)"
Write-Host "2) $destLocal ($( (Get-Item $destLocal).Length ) bytes)"
