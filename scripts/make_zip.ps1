$src = "C:\Users\annu bhai\Desktop\Pescouncil\pesc-platform"
$stage = "C:\Users\annu bhai\Desktop\pesc-stage"
$zip = "C:\Users\annu bhai\Desktop\pesc-platform-fresh.zip"

if (Test-Path $stage) { Remove-Item -Recurse -Force $stage }
if (Test-Path $zip) { Remove-Item -Force $zip }

robocopy $src $stage /E /XD node_modules .git .wrangler /XF *.zip | Out-Null

Compress-Archive -Path "$stage\*" -DestinationPath $zip -CompressionLevel Optimal

Remove-Item -Recurse -Force $stage
$sizeMb = [math]::Round((Get-Item $zip).Length / 1MB, 2)
Write-Host "SUCCESS: Created fresh zip at $zip with size $sizeMb MB"
