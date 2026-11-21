# bookmarklet

<!-- このファイルは AI エージェント（Claude Code・Codex など）と人の両方に向けた、このリポジトリの作業規則。
     「プロジェクト固有」の節はプロジェクトごとに書き換え、「共通の規則」の節は sahokun の全リポジトリで共通に保つ。 -->

## プロジェクト固有

### 概要

My Crypto Heroes（MCH）と関連サイト向けのブックマークレット集。ブラウザのブックマークに登録して、ゲームの画面上で集計や入力の補助をする。

### 技術スタックと構成

- 素の JavaScript。ブックマークレットごとにディレクトリを分ける（`mch-team-code/`・`mch-craft-shortage/`・`mch-lab/` など）。
- 各ディレクトリに、元のソース（`*-bookmarklet.js`）と、google-closure-compiler で圧縮して先頭に `javascript:` を付けた `*.min.js` を置く。使い方の説明は `*.md`。
- 圧縮のコマンドは `.vscode/tasks.json` のタスク（`Minify(...)`）にまとめてある。

### 確認の手順

```bash
npm ci
npx google-closure-compiler --js=<ソース>.js --js_output_file=<ソース>.min.js && sed -i '1s/^/javascript:/' <ソース>.min.js
```

- テストは無い。ソースを変えたら `.min.js` も作り直し、ブラウザで実際の画面に当てて動作を確かめる。

## 共通の規則

### ブランチと PR

<!-- branch-model:begin -->
- 既定のブランチは `main`（本番）。統合用の `develop` を持つ。
- 作業はブランチを切り、`develop` への PR にする。squash merge で取り込み、develop の履歴には PR のタイトルだけが残る。
- `develop` から `main` へはマージコミットで取り込む。squash や rebase にすると、2 つのブランチの履歴が別物になり、次の取り込みで同じ差分や衝突が繰り返し出るため。
- `main` を直接直したとき（Dependabot のセキュリティ更新・緊急の修正）は、`main` を `develop` にマージし戻す。セキュリティ更新は常に既定のブランチ（main）に届く。
- 管理者は `develop` に直接 push できる（ローカルでの検証用）。`main` には PR でしか入れない。
<!-- branch-model:end -->
- PR のタイトルは Conventional Commits（`feat: ...`・`fix: ...` など）で、変更の内容が 1 行で分かるように書く。
- PR がマージされたら、作業ブランチは自動で削除される。

### 履歴と公開物に書かないもの

- メールアドレス・トークン・パスワード・個人の環境の情報・AI エージェントのセッションへのリンクを、コミット・PR・Issue・コメントに書かない。
  - 作業ブランチのコミットと PR は、マージ後も GitHub に残り続け、所有者でも消せない。main の履歴も書き換えには強制 push とサポートへの依頼が要る。PR の本文だけは後から編集で直せる。
- コミットの作成者のメールアドレスは、GitHub の noreply アドレス（`<ID>+<ユーザー名>@users.noreply.github.com`）を使う。
- `.env`・鍵ファイル・ローカル設定（`.claude/settings.local.json` など）はコミットしない。

### 依存関係

- 追加・更新する依存は、公開から 7 日以上たったバージョンに限る。公開直後に乗っ取り・差し替えが見つかる事例が多いため。
  - Dependabot のバージョン更新は `cooldown` で 7 日待つ。npm は `.npmrc` の `min-release-age=7` で手作業の更新にも同じ制限を掛ける。
- GitHub Actions のアクションは、フル SHA（40 桁）で固定し、行末にバージョンをコメントで残す（例: `actions/checkout@<SHA> # v7.0.1`）。タグは差し替えられるため。
- Dependabot の PR は、更新を知らせる合図として扱う。CI が通ることと、メジャー更新では変更点を確かめてから取り込む。
