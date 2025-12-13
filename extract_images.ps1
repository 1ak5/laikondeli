$text = Get-Content 'laikon_source.html' -Raw
$pattern = 'https://static\.wixstatic\.com/media/[a-zA-Z0-9_\-\.]+\.(jpg|png|webp|jpeg)'
[regex]::Matches($text, $pattern) | ForEach-Object { $_.Value } | Select-Object -Unique | Out-File -FilePath 'extracted_images.txt' -Encoding utf8
