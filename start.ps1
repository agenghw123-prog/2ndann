$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    $runtimeRoot = Join-Path $env:LOCALAPPDATA 'codex-runtimes'
    $runtime = Get-ChildItem -LiteralPath $runtimeRoot -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like 'node-v24*-win-x64' } |
        Sort-Object Name -Descending | Select-Object -First 1
    if (-not $runtime) { throw 'Install Node.js 24 LTS, then run this script again.' }
    $env:Path = $runtime.FullName + ';' + $env:Path
}
if (-not (Test-Path -LiteralPath 'node_modules')) {
    & npm.cmd ci
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
& npm.cmd run dev
exit $LASTEXITCODE
