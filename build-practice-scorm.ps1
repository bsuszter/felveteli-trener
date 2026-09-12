$src = Split-Path -Parent $MyInvocation.MyCommand.Path
$build = Join-Path $src "scorm-practice-build"
$zip = Join-Path $src "Helyesirasi_gyakorlobank_SCORM12.zip"

if (Test-Path $build) {
    Remove-Item $build -Recurse -Force
}
if (Test-Path $zip) {
    Remove-Item $zip -Force
}

New-Item -ItemType Directory -Path $build | Out-Null

$files = @(
    "launch-practice.html",
    "index.html",
    "module-router.js",
    "modules.css",
    "styles.css",
    "learning.css",
    "practice.css",
    "practice.js",
    "practice-numbers.js",
    "scorm.js",
    "app-practice.js",
    "rewards.js"
)

foreach ($file in $files) {
    Copy-Item (Join-Path $src $file) (Join-Path $build $file)
}

Copy-Item (Join-Path $src "imsmanifest-practice.xml") (Join-Path $build "imsmanifest.xml")

Compress-Archive -Path (Join-Path $build "*") -DestinationPath $zip -Force

Write-Host ""
Write-Host "Kész:"
Write-Host $zip
