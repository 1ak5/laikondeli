$text = Get-Content 'laikon_source.html' -Raw
[regex]::Matches($text, '#[0-9a-fA-F]{6}') | ForEach-Object { $_.Value } | Group-Object | Sort-Object Count -Descending | Select-Object -First 20 | Format-Table Count, Name -AutoSize
