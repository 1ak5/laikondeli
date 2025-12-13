$content = Get-Content 'index.html'
$content[63] = '                <img src="assets/images/section-img.jpg" alt="Charcuterie Board">'
$content | Set-Content 'index.html'
