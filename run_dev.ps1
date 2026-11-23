# ==============================================================================
# Tech Supply Chain Atlas - 本地一鍵開發啟動腳本
# 同時啟動 FastAPI 後端 (Port 8000) 與 Vite 前端 (Port 3000)
# ==============================================================================

$root = $PSScriptRoot
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  啟動 Tech Supply Chain Atlas 全球供應鏈圖譜系統" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. 啟動後端 FastAPI
$backendDir = Join-Path $root "backend"
Write-Host "[1/2] 正在啟動後端分析引擎 (FastAPI @ http://127.0.0.1:8000)..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "$backendDir\.venv\Scripts\python.exe" `
    -ArgumentList "-m uvicorn main:app --host 127.0.0.1 --port 8000 --reload" `
    -WorkingDirectory $backendDir `
    -PassThru

# 2. 啟動前端 Vite
$frontendDir = Join-Path $root "frontend"
Write-Host "[2/2] 正在啟動前端互動畫布 (Vite @ http://localhost:3000)..." -ForegroundColor Green

# 確保環境 PATH 包含 Node.js
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Start-Process "http://localhost:3000"

try {
    Set-Location $frontendDir
    npm run dev
} finally {
    Write-Host "`n正在關閉後端服務..." -ForegroundColor Yellow
    Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
    Write-Host "服務已安全停止。" -ForegroundColor Gray
}
