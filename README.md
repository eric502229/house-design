# 室內設計整合台｜Cloudflare Pages 即時同步版

這個專案已可直接部署到 **Cloudflare Pages**。

## 目錄

- `index.html`：前端頁面
- `functions/api/data.js`：即時同步 API
- `wrangler.toml`：KV 綁定設定範本

## 你要做的事

### 1. 建立 Cloudflare KV

在 Cloudflare 建立一個 KV namespace，例如：

- 名稱：`ROOMSYNC`

建立後把 namespace id 填進 `wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "ROOMSYNC"
id = "你的 KV namespace id"
```

### 2. 部署到 Cloudflare Pages

把整個專案上傳到 GitHub 後，在 Cloudflare Pages 建立新專案並連結該 repo。

建議設定：

- Build command：留空
- Build output directory：`/`
- Root directory：留空

### 3. 綁定 KV

在 Cloudflare Pages 專案設定中加入 KV binding：

- Variable name：`ROOMSYNC`
- KV namespace：你剛建立的那個

### 4. 重新部署

部署完成後，頁面會自動使用同站的 API：

- `GET /api/data`
- `PUT /api/data`

不需要再額外加 `?share=`。

## 同步方式

- 輸入後約 1.2～1.4 秒自動推送
- 其他開啟中的頁面約每 2.5 秒自動抓新版本
- 若雙方同時改到不同版本，會跳出「載入對方版本 / 以目前內容覆蓋」

## 為什麼這版可行

因為資料不再靠 GitHub 上的靜態 `plans.json`，而是改由 Cloudflare Pages Functions + KV 負責讀寫。

## 如果你要保留 GitHub Pages

也可以，但就要把 `index.html` 放 GitHub Pages，另外準備一個可寫入的 API，並使用：

```text
?share=https://你的-api-url
```

這份 `index.html` 已支援這個參數。
