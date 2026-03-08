# Bar Menu - Cocktail Menu App

## Overview
GitHub Pagesで公開するカクテルメニューサイト。DBは持たず、データはJSONで管理する。

## Tech Stack
- バニラ HTML/CSS/JavaScript（ビルドステップなし）
- GitHub Pages でホスティング
- GitHub Actions でデプロイ（`.github/workflows/pages.yml`）

## Structure
```
├── index.html          # 一覧ページ
├── detail.html         # 詳細ページ（?id=xxx）
├── data/
│   └── cocktails.json  # カクテルデータ
├── images/
│   └── cocktails/      # カクテル画像
├── css/
│   └── style.css
└── js/
    └── app.js
```

## Data Management
- カクテルデータは `data/cocktails.json` で管理
- データの追加・変更はAIに依頼してJSONを編集し、コミットする運用
- 各カクテルのスタイル: `short`(🍸) / `long`(🥂) / `rock`(🥃)

## URL
https://maccotsan.github.io/bar/
