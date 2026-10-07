$ErrorActionPreference = 'Stop'
$dietProject = $PSScriptRoot
$dietUrl = 'http://127.0.0.1:4173/'
try {
    $dietReady = $false
    try { $dietPage = Invoke-WebRequest -Uri $dietUrl -UseBasicParsing -TimeoutSec 2; $dietReady = $dietPage.StatusCode -eq 200 -and $dietPage.Content.Contains('VetDiet') } catch {}
    if (-not $dietReady) {
        $dietNode = Get-Command node.exe -ErrorAction SilentlyContinue
        if ($dietNode) { $dietNodePath = $dietNode.Source } else { $dietNodePath = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' }
        if (-not (Test-Path -LiteralPath $dietNodePath)) { throw 'Node.js runtime was not found. Open patient-diet/dist/index.html in your browser, or install Node.js from nodejs.org.' }
        $dietServerPath = Join-Path $dietProject 'serve.cjs'
        Start-Process -FilePath $dietNodePath -ArgumentList ('"' + $dietServerPath + '"') -WorkingDirectory $dietProject -WindowStyle Hidden
        for ($dietAttempt = 0; $dietAttempt -lt 20; $dietAttempt++) {
            Start-Sleep -Milliseconds 250
            try { $dietPage = Invoke-WebRequest -Uri $dietUrl -UseBasicParsing -TimeoutSec 1; if ($dietPage.StatusCode -eq 200 -and $dietPage.Content.Contains('VetDiet')) { $dietReady = $true; break } } catch {}
        }
    }
    if (-not $dietReady) { throw 'The local server could not start. Port 4173 may be used by another application.' }
    Start-Process $dietUrl
} catch { Write-Host $_.Exception.Message; Read-Host 'Press Enter to close' }
