# Départ — コーチングサービス Webサイト

コーチングサービスの情報発信を目的としたWebサイトです。サービス紹介ページとブログ機能を制作し、公開・運用に取り組みました。クライアントの許可を得て、ポートフォリオ用にソースコードを公開しています。

- **公開サイト**：[Départ](https://depart-coaching.netlify.app/)
- **担当範囲**：HTML/CSS/JavaScriptによるページ制作、Netlifyへの公開、microCMS連携、ブログ表示機能の追加、運用・改善
- **特徴**：クライアントがmicroCMSから記事を管理でき、サイト側で記事一覧・記事詳細を表示できます。

## 使用技術

| 分類 | 技術 | 用途 |
| --- | --- | --- |
| フロントエンド | HTML / CSS / JavaScript | ページ構造、スタイル、ブログ表示 |
| CMS | microCMS | ブログ記事の管理と配信 |
| ホスティング | Netlify | 静的サイトの公開 |
| サーバー側処理 | Netlify Functions (JavaScript) | microCMS APIへのリクエスト中継 |
| 運用 | Google Search Console | 検索エンジンへの登録・確認 |

## システム構成

```text
【閲覧者のブラウザ】
  HTML / CSS / JavaScript
          |
          | 記事取得リクエスト
          v
【Netlify Functions】
  /.netlify/functions/blogs
  APIキーを環境変数から取得
          |
          | microCMS APIへリクエスト
          v
【microCMS】
  ブログ記事データを管理
          |
          | JSONレスポンス
          v
【Netlify Functions】
          |
          | JSONレスポンス
          v
【閲覧者のブラウザ】
  記事を画面に表示
```



ブラウザはNetlify Functionsのエンドポイントにアクセスします。Functionsがサーバー側の環境変数からAPIキーを読み取り、microCMS APIへリクエストを送信します。返却されたJSONをブラウザ側JavaScriptで処理し、記事一覧や記事詳細として表示します。

## 主な実装

### 1. ブログ一覧・記事詳細の表示

- `js/blog-list.js`：記事一覧を取得してカード形式で表示
- `js/blog-latest.js`：新着記事を最大3件表示
- `js/blog-article.js`：URLクエリの `id` から記事詳細を取得・表示
- `js/microcms-common.js`：日付整形やHTMLエスケープなどの共通処理

記事取得に失敗した場合は、画面にエラーメッセージを表示する処理を実装しています。

### 2. APIキーをブラウザに公開しない構成

`netlify/functions/blogs.js` では、以下のように環境変数からAPIキーを読み込みます。

```js
const key = process.env.MICROCMS_API_KEY;
```

APIキーはブラウザ向けのHTMLやJavaScriptに埋め込まず、Netlify側で管理します。リクエストにはGETメソッドの制限、記事IDの形式チェック、取得件数の上限設定を設けています。

### 3. 表示データの取り扱い

記事タイトル等の文字列をHTMLに埋め込む際にはエスケープ処理を行っています。記事本文はDOMPurifyによるサニタイズ処理を使用しています（ライブラリが利用できない場合、本文を空文字列として扱う実装です）。

## 開発・調査で取り組んだこと

microCMSとNetlify Functionsの連携に際し、APIのJSONレスポンス、デプロイされたファイル構成、環境変数、ブラウザでの表示をそれぞれ確認し、処理のどの段階に問題があるかを切り分けました。

**調査の考え方**：

1. FunctionsのエンドポイントからJSONが取得できるか確認
2. ブラウザ側の取得処理と表示処理を分けて確認
3. 配置したファイルとNetlifyの設定を照合
4. 修正後に記事データの表示を再確認

この経験を通じて、フロントエンドとサーバー側処理の境界を意識し、段階的に動作確認する重要性を学びました。

> ※特定のエラー原因や修正内容の詳細は、当時の作業記録を確認できた範囲で追記予定です。

## ディレクトリ構成

```text
.
├── index.html                # トップページ
├── business.html             # サービス紹介
├── personal.html             # サービス紹介
├── styles.css                # スタイル
├── blog/
│   ├── index.html            # ブログ一覧
│   └── article.html          # 記事詳細
├── js/                       # ブログ取得・表示処理
├── netlify/
│   └── functions/
│       └── blogs.js          # microCMS API中継
├── assets/                   # 画像・資料
├── netlify.toml              # Netlify設定
└── .env.example              # 環境変数名のサンプル
```

## ローカル確認・デプロイに関する注意

静的ページはHTMLファイルから確認できますが、ブログ機能はNetlify Functionsの実行環境と環境変数が必要です。実際のAPIキーはリポジトリに含めません。

Netlifyで設定する環境変数：

- `MICROCMS_API_KEY`：microCMSのAPIキー（必要最小限の読み取り権限を推奨）
- `MICROCMS_SERVICE_DOMAIN`：microCMSのサービスドメイン

`.env.example` は設定例であり、実際の認証情報は含みません。

## 今後の改善候補

- ブログ取得処理の重複コードを共通化する
- エラー表示を利用者向けの文言に改善する
- API連携や画面表示の自動テストを追加する

## 公開について

本リポジトリはポートフォリオ用の公開版です。運用中サイトとコードが完全に同期しているとは限りません。クライアント提供の画像・文章・資料などの無断転載や再配布はお控えください。
