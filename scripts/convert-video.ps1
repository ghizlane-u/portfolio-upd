# Convertit n'importe quelle vidéo en MP4 lisible partout (H.264 + AAC) et la place dans public/videos.
# Usage :  powershell -ExecutionPolicy Bypass -File scripts/convert-video.ps1 -In "C:\chemin\ma-video.mov" -Id farming
# Nécessite ffmpeg (winget install Gyan.FFmpeg).
param(
  [Parameter(Mandatory = $true)][string]$In,
  [Parameter(Mandatory = $true)][string]$Id
)
$out = Join-Path $PSScriptRoot "..\public\videos\$Id.mp4"
ffmpeg -y -i $In -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -vf "scale='min(1280,iw)':-2" -c:a aac -b:a 128k -movflags +faststart $out
Write-Host "Terminé : $out"
