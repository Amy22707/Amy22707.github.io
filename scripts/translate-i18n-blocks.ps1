param([int]$Shard = 0, [int]$Shards = 1)
$ErrorActionPreference = 'Stop'
$directory = Join-Path $PSScriptRoot '../.studio-workspace/i18n'
$inventory = Get-Content -LiteralPath (Join-Path $directory 'blocks-inventory.json') -Raw | ConvertFrom-Json
$fileName = if ($Shards -eq 1) { 'blocks-translations.json' } else { "blocks-translations-worker-$Shard.json" }
$output = Join-Path $directory $fileName
$cache = @{}
foreach ($path in @((Join-Path $directory 'blocks-translations.json'), $output) | Select-Object -Unique) {
  if (Test-Path -LiteralPath $path) { $entries = Get-Content -LiteralPath $path -Raw | ConvertFrom-Json -AsHashtable; foreach ($key in $entries.Keys) { $cache[$key] = $entries[$key] } }
}
function New-Session {
  $page = Invoke-WebRequest -Uri 'https://www.bing.com/translator' -TimeoutSec 30
  $script:session = [regex]::Match($page.Content, 'params_AbusePreventionHelper\s*=\s*(\[[^\]]+\])').Groups[1].Value | ConvertFrom-Json
  $script:ig = [regex]::Match($page.Content, 'IG:"([^"]+)"').Groups[1].Value
  if (-not $script:session) { throw 'Could not initialize the public translation session.' }
}
function Translate([string]$value) {
  $body = @{ fromLang = 'auto-detect'; text = $value; to = 'en'; token = $script:session[1]; key = $script:session[0] }
  $answer = Invoke-RestMethod -Uri ('https://www.bing.com/ttranslatev3?isVertical=1&IG=' + $script:ig + '&IID=translator.5028') -Method Post -Body $body -TimeoutSec 45
  $translated = @($answer)[0].translations[0].text
  if ([string]::IsNullOrWhiteSpace($translated)) { throw 'No translation was returned.' }
  return [string]$translated
}
function Markers([string]$value) { return (([regex]::Matches($value, '\[\[[AOC]\d+\]\]') | ForEach-Object Value | Sort-Object) -join '|') }
$texts = @($inventory | ForEach-Object text | Select-Object -Unique)
$pending = @(); for ($i = 0; $i -lt $texts.Count; $i++) { if ($i % $Shards -eq $Shard -and -not $cache[$texts[$i]].en) { $pending += $texts[$i] } }
if ($pending.Count) { New-Session }
$cursor = 0; $batchNumber = 0
while ($cursor -lt $pending.Count) {
  $batch = @(); $length = 0
  while ($cursor -lt $pending.Count -and ($batch.Count -eq 0 -or $length + $pending[$cursor].Length + 100 -lt 850)) {
    $batch += $pending[$cursor]; $length += $pending[$cursor].Length + 100; $cursor++
  }
  $parts = for ($i = 0; $i -lt $batch.Count; $i++) { '__SEGMENT_' + $i.ToString('D5') + "__`n" + ([regex]::Replace($batch[$i], '(\[\[[AOC]\d+\]\])', ' $1 ')) }
  $answer = $null
  for ($attempt = 0; $attempt -lt 3; $attempt++) {
    try { $answer = Translate ($parts -join "`n"); break }
    catch { if ($attempt -eq 2) { throw }; New-Session }
  }
  $matches = [regex]::Matches($answer, '__SEGMENT_(\d{5})__\s*([\s\S]*?)(?=__SEGMENT_\d{5}__|\z)')
  for ($i = 0; $i -lt $batch.Count; $i++) {
    $value = if ($matches.Count -eq $batch.Count -and [int]$matches[$i].Groups[1].Value -eq $i) { $matches[$i].Groups[2].Value.Trim() } else { Translate $batch[$i] }
    if ((Markers $value) -ne (Markers $batch[$i])) { $value = Translate $batch[$i] }
    if ((Markers $value) -eq (Markers $batch[$i]) -and -not [string]::IsNullOrWhiteSpace($value)) {
      $value = [regex]::Replace($value, '\s+([,.;:!?])', '$1')
      $cache[$batch[$i]] = @{ en = $value }
    } else { $cache[$batch[$i]] = @{ error = 'Inline markers did not survive translation.' } }
  }
  $cache | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $output -Encoding utf8
  $batchNumber++
  Write-Output "Shard $Shard`: $cursor/$($pending.Count) sentence drafts"
  if ($batchNumber % 18 -eq 0) { New-Session }
}
Write-Output "Shard $Shard completed."
