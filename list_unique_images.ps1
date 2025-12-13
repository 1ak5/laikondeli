$text = Get-Content 'laikon_source.html'
$pattern = 'https://static\.wixstatic\.com/media/([a-zA-Z0-9_]+~mv2\.(jpg|png))'
$matches = [regex]::Matches($text, $pattern)
$uniqueImages = $matches | ForEach-Object { $_.Value } | Select-Object -Unique
$uniqueImages | Out-File -FilePath 'unique_images_list.txt' -Encoding utf8
