Get-ChildItem -Path . -Recurse -Include *.js | ForEach-Object {
    Write-Output "--- Checking: $($_.FullName)"
    node --check $_.FullName 2>&1
}