# Départ — コーチングサービス Webサイト

コーチングサービスの紹介とブログ記事の公開・更新を目的として制作したWebサイトです。クライアントの許可を得て、ポートフォリオ用にソースコードを公開しています。

## 使用技術
- HTML / CSS / JavaScript
- microCMS（記事管理）
- Netlify / Netlify Functions（サーバー側APIプロキシ）

## 主な実装
- サービス紹介ページ・ブログ一覧・記事詳細
- microCMSで管理する記事データの取得と表示
- Netlify Functionsを介したAPI通信（APIキーをブラウザ側に配置しない）
- レスポンシブな画面構成

## 構成
- `index.html`：トップページ
- `business.html` / `personal.html`：サービス紹介
- `styles.css`：スタイル
- `blog/`：ブログページ
- `js/`：ブログ表示処理
- `netlify/functions/blogs.js`：microCMS APIへのサーバー側プロキシ
- `netlify.toml`：Netlify設定
- `assets/`：サイト素材（利用許諾の範囲で収録）

## 環境変数
Netlifyの環境変数に次を設定します。実際のキーはGitHubに登録しません。

- `MICROCMS_API_KEY`：microCMSの読み取り専用APIキー（公開記事のみ取得できる権限を推奨）
- `MICROCMS_SERVICE_DOMAIN`：microCMSのサービスドメイン

`.env.example` は変数名の例です。実際の値を含む `.env` ファイルはコミットしないでください。

## 公開・運用上の注意
- このリポジトリにはAPIキーを含めていません。
- ブログ機能はNetlify Functionsと環境変数の設定が必要です。HTMLファイルをローカルで開くだけではブログAPIは動きません。
- 本番サイトとこのリポジトリのコードが完全に同期しているとは限りません。デプロイ前に動作を確認してください。
- クライアント提供素材の再利用は許可されていません。第三者による無断転載・再配布はお控えください。
