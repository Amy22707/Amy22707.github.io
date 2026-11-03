param([int]$Shard = 0, [int]$Shards = 1)
$ErrorActionPreference = 'Stop'
$inventoryPath = Join-Path $PSScriptRoot '../.studio-workspace/i18n/inventory.json'
$cachePath = Join-Path $PSScriptRoot '../.studio-workspace/i18n/translations.json'
$seedPath = $cachePath
if ($Shards -gt 1) { $cachePath = Join-Path $PSScriptRoot "../.studio-workspace/i18n/translations-worker-$Shard.json" }
$inventory = Get-Content -LiteralPath $inventoryPath -Raw | ConvertFrom-Json
$cache = @{}
# Merge completed work before sharding: adding a post changes inventory indexes.
# Otherwise an incremental run would resend previously translated paragraphs.
$cacheDirectory = Split-Path -Parent $seedPath
foreach ($file in (Get-ChildItem -LiteralPath $cacheDirectory -File | Where-Object { $_.Name -match '^translations(?:-worker-\d+)?\.json$' } | Sort-Object Name)) {
  $entries = Get-Content -LiteralPath $file.FullName -Raw | ConvertFrom-Json -AsHashtable
  foreach ($sourceText in $entries.Keys) {
    if (-not $cache.ContainsKey($sourceText)) { $cache[$sourceText] = @{ en = $sourceText; zh = $sourceText; completed = @() } }
    foreach ($language in $entries[$sourceText].completed) {
      $cache[$sourceText][$language] = $entries[$sourceText][$language]
      if ($cache[$sourceText].completed -notcontains $language) { $cache[$sourceText].completed += $language }
    }
  }
}
$overrides = Get-Content -LiteralPath (Join-Path $PSScriptRoot '../src/i18n/overrides.json') -Raw | ConvertFrom-Json -AsHashtable
$preserve = @('Amy Studio', "Amy's Space", 'Amy_xue', 'Xue Zhiyao', 'Zhiyao Xue', '薛之瑶', 'GitHub', 'Python', 'C++', 'PyTorch', 'NumPy', 'Git', 'Linux', 'LaTeX', 'Astro', 'TypeScript', 'Windows', 'Android', 'Web', 'iOS / Web', 'WebSocket', 'ICS', 'InsightFace', 'Botzone', 'OOP', 'Cpp', 'AI', 'LLM', 'KV', 'CSS', 'HTML', 'JSON', 'Hazy Lane', 'Mars_Dingdang', 'Luogu')
$terms = [ordered]@{
  '《旅行青蛙·中国之旅》' = 'Travel Frog: A Journey to China'
  '旅行青蛙·中国之旅' = 'Travel Frog: A Journey to China'
  '旅行青蛙' = 'Travel Frog'
  '图鉴版' = 'Gallery Edition'
  '普通版' = 'Standard Edition'
  '标准版' = 'Standard Edition'
  '放铳率' = 'deal-in rate'
  '放铳' = 'dealing in'
  '向听数' = 'shanten number'
  '向听' = 'shanten'
  '听牌' = 'tenpai'
  '番型' = 'fan patterns'
  '番数' = 'fan value'
  '官服' = 'official game server'
  '牌墙' = 'tile wall'
  '复健' = 'brushing up'
  '小作文' = 'personal reflection'
}
$courseTerms = @{ '计概' = 'Introduction to Computing'; '数算' = 'Data Structures and Algorithms'; '程设' = 'Programming Practice' }
function New-TranslationSession {
  $page = Invoke-WebRequest -Uri 'https://www.bing.com/translator' -TimeoutSec 30
  $script:session = [regex]::Match($page.Content, 'params_AbusePreventionHelper\s*=\s*(\[[^\]]+\])').Groups[1].Value | ConvertFrom-Json
  $script:ig = [regex]::Match($page.Content, 'IG:"([^"]+)"').Groups[1].Value
  if (-not $script:session) { throw 'The public translation session could not be initialized.' }
}
function Translate-Text([string]$value, [string]$target) {
  $inputText = $value
  if ($target -eq 'en') {
    foreach ($term in $terms.Keys) { $inputText = $inputText.Replace($term, $terms[$term]) }
    # Course abbreviations must not match inside words such as 立即数算术 or 短程设置.
    foreach ($term in $courseTerms.Keys) { $inputText = [regex]::Replace($inputText, '(?<![\u3400-\u9fff])' + [regex]::Escape($term), $courseTerms[$term]) }
  }
  $body = @{ fromLang = 'auto-detect'; text = $inputText; to = $target; token = $script:session[1]; key = $script:session[0] }
  $result = Invoke-RestMethod -Uri ('https://www.bing.com/ttranslatev3?isVertical=1&IG=' + $script:ig + '&IID=translator.5028') -Method Post -Body $body -TimeoutSec 45
  if (-not @($result)[0].translations) { throw ('Translation service error: ' + $result.statusCode + ' ' + $result.errorMessage) }
  $translated = @($result)[0].translations[0].text
  if (-not $translated) { throw 'The translation service returned no text.' }
  return [string]$translated
}
$batchNumber = 0
foreach ($target in @('en', 'zh-Hans')) {
  $language = if ($target -eq 'en') { 'en' } else { 'zh' }
  $pending = [Collections.Generic.List[object]]::new()
  $inventoryIndex = -1
  foreach ($item in $inventory) {
    $inventoryIndex++
    if ($inventoryIndex % $Shards -ne $Shard) { continue }
    $sourceText = [string]$item.text
    if (-not $cache.ContainsKey($sourceText)) { $cache[$sourceText] = @{ en = $sourceText; zh = $sourceText; completed = @() } }
    if ($overrides.ContainsKey($sourceText) -and $overrides[$sourceText].ContainsKey($language)) {
      $cache[$sourceText][$language] = $overrides[$sourceText][$language]
      if ($cache[$sourceText].completed -notcontains $language) { $cache[$sourceText].completed += $language }
    }
    if ($cache[$sourceText].completed -contains $language) { continue }
    $needsTranslation = if ($language -eq 'en') { $sourceText -match '[\u3400-\u9fff]' } else { $sourceText -match '[A-Za-z]' -and $sourceText -notmatch '[\u3400-\u9fff]' }
    if ($preserve -contains $sourceText -or -not $needsTranslation) { $cache[$sourceText].completed += $language; continue }
    $pending.Add($item)
  }
  $cursor = 0
  if ($pending.Count -gt 0) { New-TranslationSession }
  while ($cursor -lt $pending.Count) {
    $batch = [Collections.Generic.List[object]]::new()
    $requestLength = 0
    while ($cursor -lt $pending.Count) {
      $item = $pending[$cursor]
      if ($batch.Count -gt 0 -and $requestLength + $item.text.Length + 35 -gt 900) { break }
      $batch.Add($item); $cursor++; $requestLength += $item.text.Length + 35
    }
    $parts = for ($i = 0; $i -lt $batch.Count; $i++) { '__SEGMENT_' + $i.ToString('D5') + "__`n" + $batch[$i].text }
    $requestText = $parts -join "`n"
    $answer = $null
    for ($attempt = 0; $attempt -lt 3; $attempt++) {
      try { $answer = Translate-Text $requestText $target; break }
      catch { if ($attempt -eq 2) { throw }; New-TranslationSession; Start-Sleep -Milliseconds 600 }
    }
    $matches = [regex]::Matches($answer, '__SEGMENT_(\d{5})__\s*([\s\S]*?)(?=__SEGMENT_\d{5}__|\z)')
    $valid = $matches.Count -eq $batch.Count
    if ($valid) { for ($i = 0; $i -lt $matches.Count; $i++) { if ([int]$matches[$i].Groups[1].Value -ne $i) { $valid = $false; break } } }
    for ($i = 0; $i -lt $batch.Count; $i++) {
      $value = if ($valid) { $matches[$i].Groups[2].Value.Trim() } else { Translate-Text $batch[$i].text $target }
      if ([string]::IsNullOrWhiteSpace($value)) { $value = Translate-Text $batch[$i].text $target }
      $cache[[string]$batch[$i].text][$language] = $value
      $cache[[string]$batch[$i].text].completed += $language
    }
    $batchNumber++
    $cache | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $cachePath -Encoding utf8
    Write-Output ("$language $cursor/$($pending.Count) translated; batch $batchNumber")
    if ($batchNumber % 18 -eq 0) { New-TranslationSession }
  }
}
$cache | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $cachePath -Encoding utf8
Write-Output 'All translation drafts completed.'
