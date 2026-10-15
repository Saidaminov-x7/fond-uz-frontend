$ErrorActionPreference = 'Stop'
$cache = 'C:\fond-uz-swc-cache'
New-Item -ItemType Directory -Force -Path $cache | Out-Null
$identity = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
& icacls.exe $cache /inheritance:r | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Could not set isolated SWC cache permissions' }
& icacls.exe $cache /grant:r "${identity}:(OI)(CI)F" 'SYSTEM:(OI)(CI)F' | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Could not grant SWC cache access' }
$env:SWC_NATIVE_BINDING_CACHE = $cache
rtk npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Output 'BUILD_PASSED'
