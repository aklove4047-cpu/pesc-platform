param(
    [string]$SourceDir = 'C:\Users\annu bhai\Desktop\Pescouncil\pesc-platform',
    [string]$ZipPath = 'C:\Users\annu bhai\Desktop\pesc-platform-fresh.zip'
)

if (Test-Path $ZipPath) {
    Remove-Item -Force $ZipPath
}

Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::Open($ZipPath, [System.IO.Compression.ZipArchiveMode]::Create)

Get-ChildItem -Path $SourceDir -Recurse | Where-Object {
    $_.FullName -notmatch '[\\/](node_modules|\.wrangler|\.git)($|[\\/])'
} | ForEach-Object {
    if (-not $_.PSIsContainer) {
        $relPath = $_.FullName.Substring($SourceDir.Length + 1)
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $relPath, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
}

$zip.Dispose()

$sizeMb = [math]::Round((Get-Item $ZipPath).Length / 1MB, 2)
Write-Host "SUCCESS: Fresh zip created at $ZipPath ($sizeMb MB)"
