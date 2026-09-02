# クリプトパズル（Cryptopuzzle）

英語の短文を暗号化された記号として提示し、推測しながら英語を学ぶクロスプラットフォーム学習アプリです。  
Web / PWA、Windows、macOS、iOS に対応しています。

## 技術スタック

- フロントエンド: React 19 + TypeScript + Vite 7
- UI: Material UI 9 + Framer Motion
- 状態管理: Zustand
- デスクトップ: Tauri v2 + Rust
- モバイル: Tauri v2（iOS）

## ディレクトリ構成

```
.
├── index.html              # Vite エントリポイント
├── package.json            # npm スクリプト / 依存
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── src/                    # React フロントエンド
│   ├── components/         # 画面コンポーネント
│   ├── components/puzzle/  # PuzzleGame 分割コンポーネント
│   ├── hooks/              # カスタム React Hooks
│   ├── stores/             # Zustand ストア
│   ├── utils/              # 各種ユーティリティ
│   ├── data/               # 教材データ
│   └── main.tsx
├── src-tauri/              # Tauri / Rust コード
│   ├── src/lib.rs          # エントリポイント
│   ├── tauri.conf.json     # Tauri 設定
│   └── icons/              # アプリアイコン
├── public/                 # PWA 用アセット
│   ├── icon.svg
│   ├── manifest.webmanifest
│   └── sw.js
├── dist/                   # ビルド出力（.gitignore）
└── AGENTS.md               # プロジェクト運用メモ
```

## 共通準備

以下はすべてのプラットフォームで必要です。

### 1. Rust

Tauri v2 を動かすため Rust が必要です。

```bash
# macOS / Linux
# https://www.rust-lang.org/ja/tools/install から rustup をインストール

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

```powershell
# Windows
# https://www.rust-lang.org/ja/tools/install から rustup-init.exe を実行
```

```bash
# インストール確認
rustc --version
```

### 2. Node.js / pnpm

Node.js 20 以上を推奨します。pnpm は `corepack` で有効化するのが簡単です。

```bash
# pnpm を有効化（Node 20.10+ など）
corepack enable
corepack prepare pnpm --activate

# 確認
pnpm --version
```

### 3. 依存インストール

```bash
# リポジトリをクローン
git clone https://github.com/na-yu-ta-n/cryptopuzzle.git
cd cryptopuzzle

# フロントエンド + Tauri CLI 等をインストール
pnpm install
```

### 4. 型チェック

```bash
npx tsc --noEmit
```

## 開発サーバー

### Web 開発

```bash
pnpm dev
```

`http://localhost:1420` で開発サーバーが起動します。

### Tauri デスクトップ開発

```bash
pnpm tauri dev
```

## 各プラットフォームのビルド手順

### 1. Web / PWA

追加ツールは不要です。

```bash
# 本番ビルド
pnpm run build

# ビルド結果をプレビュー
pnpm preview
```

`dist/` 配下に静的ファイルが出力されます。 `dist/index.html` を開くだけでは PWA 機能（Service Worker 等）が動作しないため、 **HTTPS** でホスティングするか、ローカルで静的サーバーを立ち上げて確認してください。

```bash
# 別途 serve を使う例
npx serve -s dist -l 3000
```

静的ホスティング（Netlify / Vercel / Cloudflare Pages / GitHub Pages など）に `dist/` の中身をアップロードすることで PWA として配布できます。

### 2. Windows デスクトップ

#### 必要な環境

- Windows 10 / 11
- Rust（`stable-x86_64-pc-windows-msvc`）
- Visual Studio 2022 Build Tools または Visual Studio Community 2022
  - ワークロード: **C++ によるデスクトップ開発**
  - 個別コンポーネント: `MSVC v143 - VS 2022 C++ x64/x86 ビルドツール`（最新）
- Microsoft Edge WebView2 Runtime（Windows 11 では標準搭載。Windows 10 では必要に応じてインストール）

#### ビルド

```powershell
# プロジェクトルートで実行
pnpm tauri build
```

完了後、以下のようなインストーラー・実行ファイルが生成されます。

- `src-tauri\target\release\bundle\msi\*.msi`
- `src-tauri\target\release\bundle\nsis\*.exe`

### 3. macOS デスクトップ

#### 必要な環境

- macOS 12（Monterey）以降
- Rust（`stable`）
- Xcode Command Line Tools

```bash
xcode-select --install
```

#### ターゲット追加（任意）

Intel Mac と Apple Silicon の両方に対応させる場合、ユニバーサルバイナリ向けターゲットを追加します。

```bash
rustup target add x86_64-apple-darwin aarch64-apple-darwin
```

#### ビルド

```bash
# Apple Silicon 単体の場合
pnpm tauri build

# ユニバーサルバイナリの場合
pnpm tauri build --target universal-apple-darwin
```

完了後、以下が生成されます。

- `src-tauri/target/release/bundle/macos/Cryptopuzzle.app`
- `src-tauri/target/release/bundle/dmg/*.dmg`

### 4. iOS（macOS 必須）

iOS ビルドは **macOS + Xcode** が必要です。

#### 必要な環境

- macOS 13（Ventura）以降
- Rust（`stable`）
- Xcode（App Store または [Apple Developer](https://developer.apple.com/download/) からインストール）
- Xcode Command Line Tools
- Homebrew
- CocoaPods

```bash
# Xcode コマンドラインツール
xcode-select --install

# Xcode をデフォルトに設定
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

# CocoaPods
brew install cocoapods
```

#### iOS 用 Rust ターゲット追加

```bash
rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim
```

#### iOS プロジェクトの初期化

初回のみ実行します。

```bash
pnpm tauri ios init
```

`src-tauri/gen/apple/` 以下に Xcode プロジェクトが生成されます。

#### 開発 / シミュレーターで実行

```bash
# 自動でシミュレーターまたは接続デバイスを選択
pnpm tauri ios dev

# 特定のシミュレーターを指定
pnpm tauri ios dev 'iPhone 15 Pro'

# 実機で開発する場合
# 事前に Xcode の Window > Devices and Simulators で接続しておき、以下を実行
TAURI_DEV_HOST=true pnpm tauri ios dev --force-ip-prompt
```

#### iOS 本番ビルド

```bash
pnpm tauri ios build
```

以下に `.ipa` が生成されます。

- `src-tauri/gen/apple/build/arm64/Cryptopuzzle.ipa`

実機配布 / App Store 提出の際は、Xcode 上で `Signing & Capabilities` の Team / Bundle Identifier / Provisioning Profile を正しく設定してください。

### 5. Android（オプション）

プロジェクトは iOS を主なモバイルターゲットとしていますが、Android ビルドも可能です。

```bash
# Android Studio をインストールし、SDK / NDK / Build-Tools をセットアップ
# https://developer.android.com/studio

# Rust ターゲット追加
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android

# 環境変数例（~/.zshrc など）
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export NDK_HOME="$ANDROID_HOME/ndk/$(ls -1 $ANDROID_HOME/ndk | sort -V | tail -1)"

# 初期化
pnpm tauri android init

# エミュレーター / 実機で実行
pnpm tauri android dev

# 本番ビルド
pnpm tauri android build
```

## トラブルシューティング

| 症状 | 対処 |
|---|---|
| `pnpm install` で Rust ツールチェーン周りのエラー | `rustc --version` が通るか確認。Windows では `stable-msvc` が選択されているか確認。 |
| `tauri build` 失敗（Windows） | Visual Studio Build Tools の「C++ によるデスクトップ開発」がインストールされているか確認。 |
| iOS シミュレーターが見つからない | Xcode を起動し、追加のシミュレーターをインストールしてください。 |
| iOS ビルドで CocoaPods エラー | `cd src-tauri/gen/apple && pod install` を試す。 |
| PWA の Service Worker が動作しない | HTTPS 経由でホスティングされているか確認。ローカルでは `npx serve -s dist` で確認可能。 |
| 型エラー | `npx tsc --noEmit` を実行し、修正してください。 |

## 環境診断

何かうまくいかない場合は、以下で環境を診断できます。

```bash
pnpm tauri info
```

## ライセンス

[LICENSE](./LICENSE) を参照してください。
