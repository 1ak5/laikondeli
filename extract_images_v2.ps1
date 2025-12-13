$text = Get-Content 'laikon_source.html'
$urls = $text | Select-String -Pattern 'https://static\.wixstatic\.com/media/[^"''\)\s,]+' -AllMatches | ForEach-Object { $_.Matches } | ForEach-Object { $_.Value } | Select-Object -Unique
$urls | Out-File -FilePath 'found_images.txt' -Encoding utf8
