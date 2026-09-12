$src = Split-Path -Parent $MyInvocation.MyCommand.Path
$build = Join-Path $src "scorm-2025-build"
$zip = Join-Path $src "Helyesiras_gyakorlas_2025_SCORM12.zip"

if (Test-Path $build) {
    Remove-Item $build -Recurse -Force
}

if (Test-Path $zip) {
    Remove-Item $zip -Force
}

New-Item -ItemType Directory -Path (Join-Path $build "modules\2025") -Force | Out-Null

$files = @(
    "imsmanifest.xml",
    "launch-2025.html",
    "index.html",
    "module-router.js",
    "module-fixes.js",
    "modules.css",
    "styles.css",
    "learning.css",
    "practice.css",
    "practice.js",
    "practice-numbers.js",
    "scorm.js",
    "app-2025.js",
    "resume-2025.js",
    "rewards.js",
    "attempt-lock.js"
)

foreach ($file in $files) {
    $source = Join-Path $src $file
    if (-not (Test-Path $source)) {
        throw "Hianyzik a fajl: $file"
    }
    Copy-Item $source (Join-Path $build $file)
}

$tasksSource = Join-Path $src "modules\2025\tasks.js"
if (-not (Test-Path $tasksSource)) {
    throw "Hianyzik a fajl: modules\2025\tasks.js"
}
Copy-Item $tasksSource (Join-Path $build "modules\2025\tasks.js")

Compress-Archive -Path (Join-Path $build "*") -DestinationPath $zip -Force

Write-Host ""
Write-Host "Kesz:"
Write-Host $zip
