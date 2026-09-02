# クリプトパズル（Cryptopazzle）仕様書・設計書

**バージョン**: 0.1.0  
**最終更新**: 2026-09-02  
**開発手法**: AI 駆動開発（AIDD）

---

## 1. プロジェクト概要

### 1.1 アプリ名

- **商品名**: Cryptopuzzle（Rust / Tauri 側）
- **画面表示タイトル**: クリプトパズル
- **パッケージ名**: `cryptopazzle`
- **リポジトリ**: `cryptopazzle`

### 1.2 コンセプト

「暗号を解いて英語を脳に焼き付ける」をキャッチコピーにした、英語学習 × 暗号パズル（Cryptogram）アプリ。

同じ英字は必ず同じ暗号記号（2 桁数字）に置き換えられる「代換式暗号」を解くことで、英文を完成させる。  
暗号化された英文を推論しながら入力する過程で、英単語・フレーズ・文法を自然に繰り返し確認するメカニクス。

### 1.3 主要ターゲット

- 暗号パズルが好きな英語学習者
- 中学・高校・受験・TOEIC など目的別に学びたいユーザー
- スマホでも PC でも短時間で遊びたいユーザー

### 1.4 プラットフォーム

- **Web/PWA**（Vite + React）
- **デスクトップ**（Tauri v2 + Rust）
- **モバイル**（IOS / Android）
- レスポンシブ UI でタッチ / キーボード両対応

---

## 2. 技術スタック

### 2.1 フロントエンド

| 技術 | 用途 |
|------|------|
| React 19 | UI フレームワーク |
| TypeScript 5.8 | 型安全な実装 |
| Vite 7 | ビルドツール / 開発サーバー |
| Material UI（MUI）9 | コンポーネント・テーマ |
| Framer Motion | アニメーション |
| canvas-confetti | クリア演出 |
| Zustand | グローバル状態管理 |
| date-fns | 日付処理 |

### 2.2 ネイティブ層

| 技術 | 用途 |
|------|------|
| Tauri v2 | Web 技術によるデスクトップアプリ化 |
| Rust 2021 | Tauri バックエンド |
| tauri-plugin-store | ローカル永続化（Tauri 版） |

### 2.3 ビルド・配布

| ファイル | 内容 |
|----------|------|
| `package.json` | npm スクリプト: `dev`, `build`, `preview`, `tauri` |
| `vite.config.ts` | Vite 設定、Tauri dev 用ポート 1420 固定 |
| `src-tauri/tauri.conf.json` | ウィンドウサイズ 1280×800、最小 960×640 |
| `src-tauri/Cargo.toml` | Rust 側依存 |
| `public/sw.js` | PWA Service Worker（ネットワーク優先・失敗時キャッシュ） |
| `dist/manifest.webmanifest` | PWA マニフェスト |

---

## 3. ゲームデザイン

### 3.1 コアメカニクス：暗号パズル

1. 教材 `Material` の英文 `en` を大文字化した上で、各英字を 2 桁の数字（01 ～ 26）へランダムに置換。
2. 同じ英字は必ず同じ数字に対応。
3. スペースと一部記号（`' . , ! ? - ; : " ( )`）はそのまま表示。
4. ユーザーはタッチ / キーボードで「数字マス」→「英字」を 1 文字ずつ入力。
5. すべてのマスを正しく埋めると英文が完成し、日本語訳・単語解説と共に表示される。

### 3.2 入力・選択の挙動

- 未入力マスをタップ / クリックで選択。
- QWERTY 配列の英字ボタン or 物理キーボード（A-Z / Backspace / 矢印 / Enter）で入力。
- すでに他のマスに割り当てられている英字を再入力すると、自動的に前のマスが解除され重複を防ぐ。
- 正解時：次の未入力マスへ自動フォーカス、コンボ +1。
- 不正解時：ミス +1、コンボリセット、シェイク演出、振動フィードバック。
- 最後まで正しく入力し終えると勝利。

### 3.3 難易度（パズル開始時のヒント数）

| 難易度 | 開始時ヒント数 |
|--------|---------------|
| 超かんたん | `min(max(8, symbolCount × 0.5), symbolCount - 1)` |
| かんたん | `min(max(4, symbolCount × 0.25), symbolCount - 1)` |
| ふつう | `min(2, symbolCount - 1)` |
| むずかしい | 0 |

### 3.4 ライフ（Freemium）システム

| 項目 | 値 |
|------|-----|
| 最大ライフ | 30 |
| 回復間隔 | 5 分ごとに 1 ライフ |
| パズル開始コスト | 1 ライフ |
| ヒントコスト | 1 ライフ |
| 動画視報酬 | 5 ライフ |
| プレミアム | ライフ消費なし・無限プレイ（テスト用トグル） |

- ライフが足りない場合は「動画を見て回復」ボタンで 3 秒カウントダウンの疑似広告再生。
- デスクトップ / Web 両方で `localStorage` または Tauri Store により永続化。

---

## 4. 画面構成

アプリは 1 つの `screen` 状態で画面を切り替えるシンプルな構造。

| 画面 | コンポーネント | 役割 |
|------|---------------|------|
| トップ / ホーム | `StartScreen` | ライフ、連続ログイン、クリア数、バッジ数、レベル、カテゴリ/難易度選択、各種モード開始 |
| パズル画面 | `PuzzleGame` | 暗号マス入力、QWERTY キーボード、ヒント、スキップ、クリア演出 |
| 復習画面 | `ReviewScreen` | SRS 復習対象 + クリア履歴から再出題 |
| コース画面 | `CourseMap` | 中学・高校・TOEIC コースのマップと進捗管理 |
| 教材画面 | `MaterialManager` | 独自教材の JSON テキスト / ファイル読み込み |
| 実績画面 | `StatsPanel` | XP/レベル、連続ログイン、累計クリア、バッジ一覧、進捗リセット |

### 4.1 トップ画面（`StartScreen`）

- タイトルロゴ「クリプトパズル」＋ サブコピー
- ライフゲージ
- 統計カード：連続ログイン / クリア数 / バッジ数 / レベル
- カテゴリ選択プルダウン
- 難易度選択プルダウン
- 大きな「コースで学ぶ」ボタン
- 「フリープレイ」ボタン
- 「デイリーチャレンジ（XP 2 倍）」ボタン
- 下部メニュー：復習 / 教材 / 実績 / 音声 ON/OFF / プレミアム（テスト）

### 4.2 パズル画面（`PuzzleGame`）

- 上部バー：カテゴリ・難易度チップ、レベル、ライフ、連続ログイン、コンボ、XP
- 中央：暗号文マトリックス
- 下部：選択中表示、進捗バー、QWERTY 英字キーボード
- アクションボタン：ヒント、確認/進む、スキップ/次へ
- 勝利時：
  - 紙吹雪演出（canvas-confetti）
  - 正解英文・日本語訳
  - 単語解説カード
  - 獲得 XP チップ
  - 次の問題 / トップに戻る ボタン
- レベルアップ時：追加紙吹雪 + LEVEL UP! 表示

### 4.3 コース画面（`CourseMap`）

- コース一覧カード
  - 中学英語コース（📗 緑）
  - 高校英語コース（📘 青）
  - TOEIC コース（💼 オレンジ）
- 各コース内：ユニット → レッスン の階層表示
- レッスン状態：
  - `done`：クリア済
  - `current`：次に挑戦可能
  - `locked`：前のレッスン未クリア

### 4.4 復習画面（`ReviewScreen`）

- **今日の復習**：SRS で期限が来た教材をリスト。ボーナス XP +5 つき。
- **履歴から復習**：直近 20 問を解いた日 / ミス回数付きで一覧表示。
- ランダム表示トグル。

### 4.5 教材画面（`MaterialManager`）

- テキストエリアに JSON を貼り付けて追加
- `.json` ファイルを読み込んで追加
- 登録済み教材一覧（デフォルト + カスタム）

---

## 5. 学習・動機づけシステム

### 5.1 XP・レベル

- 基本 XP = `round((10 + wordCount × 2) × difficultyMultiplier + perfectBonus)`
- difficultyMultiplier: easy=1, medium=1.5, hard=2
- perfectBonus: ミス 0 回で +10
- コンボボーナス：コンボ数 × 3
- デイリーチャレンジ：XP × 2
- 復習：+5 XP
- レベル = `floor(xp / 100) + 1`

### 5.2 コンボ

- 連続正解でコンボ +1。
- 5 コンボごとに効果音変化。
- ミスでリセット。

### 5.3 連続ログイン（Streak）

- クリア日を記録。
- 前日クリア済みなら連続 +1。
- それ以外でクリアしたら連続を 1 からリセット。
- 月別クリア数もカウント。

### 5.4 バッジ

| バッジ ID | 名称 | 条件 |
|-----------|------|------|
| `first-blood` | First Step | 累計 1 問クリア |
| `streak-3` | 3 Day Streak | 3 日連続 |
| `streak-7` | Week Warrior | 7 日連続 |
| `streak-30` | Monthly Flame | 30 日連続 |
| `xp-100` | Rising Star | 累計 XP 100 |
| `xp-1000` | Cryptogram Master | 累計 XP 1000 |
| `monthly-bronze` | Monthly Bronze | 今月 10 問 |
| `monthly-silver` | Monthly Silver | 今月 30 問 |
| `monthly-gold` | Monthly Gold | 今月 50 問 |
| `master-100` | Centurion | 累計 100 問 |

### 5.5 SRS 復習（忘却曲線）

- 初回クリア：stage 0、1 日後復習
- 2 回目：stage 1、3 日後
- 3 回目：stage 2、7 日後
- 4 回目以降：mastered（復習リストから卒業）
- 期限切れ教材を「今日の復習」として優先表示。

---

## 6. データ設計

### 6.1 教材 `Material`

```ts
interface Material {
  id: string;           // 一意 ID
  en: string;           // 英文（元文）
  ja: string;           // 日本語訳
  category?: Category;  // daily | motivation | business | ...
  difficulty?: Difficulty; // easy | medium | hard
  hint?: string;
  words?: VocabWord[];  // 単語・フレーズ解説
}
```

### 6.2 コース `Course`

```ts
interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;     // emoji
  color: string;    // HEX 色
  units: Unit[];
}
```

### 6.3 セッション `SessionInfo`

```ts
type SessionType = 'free' | 'lesson' | 'daily' | 'review';
```

### 6.4 ユーザー状態（Zustand Store）

- `stats`：XP / レベル / 累計クリア / 連続ログイン / 月別 / バッジ / 履歴
- `settings`：音声・演出・カテゴリ・難易度・プレミアム
- `customMaterials`：ユーザー追加教材
- `puzzle`：現在の暗号パズル
- `guesses`：現在の推測
- `srs`：SRS 状態
- `courseProgress`：コース別クリア済み教材 ID
- `lives` / `maxLives` / `lastLifeUpdate`

### 6.5 永続化

- Tauri 環境：`tauri-plugin-store` の `app-data.json`
- Web/PWA 環境：`localStorage`（zustand persist）
- Store キー：`cryptopuzzle-store`

---

## 7. システム構成図

```
┌─────────────────────────────────────────────┐
│  UI レイヤ（React + MUI + Framer Motion）    │
│  Start / Puzzle / Review / Course / ...     │
├─────────────────────────────────────────────┤
│  状態管理（Zustand + persist）               │
│  useAppStore：ゲーム進行・統計・設定         │
├─────────────────────────────────────────────┤
│  ドメインロジック                            │
│  cipher.ts / life.ts / srs.ts / badges.ts   │
│  sound.ts / haptic.ts                       │
├─────────────────────────────────────────────┤
│  データ層                                    │
│  defaultMaterials.json / courses.ts          │
│  storage.ts（Tauri Store / localStorage）    │
├─────────────────────────────────────────────┤
│  配布層                                      │
│  Vite → dist                                 │
│  Tauri v2 → Windows / macOS / Linux         │
│  PWA（SW + manifest）                       │
└─────────────────────────────────────────────┘
```

---

## 8. 主要ファイル構成

```
/
├── package.json
├── vite.config.ts
├── index.html
├── public/
│   ├── sw.js                  # PWA Service Worker
│   └── manifest.webmanifest   # PWA マニフェスト
├── src/
│   ├── App.tsx                # 画面ルーティング
│   ├── main.tsx               # React エントリ
│   ├── theme.ts               # MUI ダークテーマ
│   ├── index.css              # グローバル CSS アニメーション
│   ├── types/index.ts         # 型定義
│   ├── stores/useAppStore.ts  # Zustand 状態管理
│   ├── data/
│   │   ├── defaultMaterials.json  # 標準教材 36 問
│   │   └── courses.ts             # 中学・高校・TOEIC コース
│   ├── components/
│   │   ├── StartScreen.tsx
│   │   ├── PuzzleGame.tsx
│   │   ├── ReviewScreen.tsx
│   │   ├── CourseMap.tsx
│   │   ├── MaterialManager.tsx
│   │   ├── StatsPanel.tsx
│   │   └── WatchAdDialog.tsx
│   └── utils/
│       ├── cipher.ts          # 暗号生成・XP 計算
│       ├── life.ts            # ライフ管理
│       ├── srs.ts             # 忘却曲線復習
│       ├── badges.ts          # バッジロジック
│       ├── sound.ts           # Web Audio API 効果音
│       ├── haptic.ts          # 振動フィードバック
│       └── storage.ts         # 永続化抽象
└── src-tauri/                 # Tauri デスクトップラッパー
    ├── tauri.conf.json
    └── Cargo.toml
```

---

## 9. AI 駆動開発（AIDD）について

本アプリは **AI 駆動開発（AI-Driven Development）** で制作しています。

- 人間が「どんなアプリにしたいか」「どんな機能が必要か」「文言や雰囲気」を指示します。
- 実装したソースコードは即座にビルド・動作確認を行い、継続的に改善しています。

本書自体も「人間が作ったアプリを AI が整理してまとめ直す」という AIDD の姿勢で作成しています。

---

## 10. 今後の拡張候補（参考）

- 広告 SDK 連携（現在は疑似カウントダウン）
- インタースティシャル広告の本実装
- 追加コース（英検、旅行、ビジネス実践 など）
- ユーザーランキング・サーバー同期
- 多言語対応
- カスタムテーマ・ダーク/ライト切り替え
- シェア機能（クリア結果を SNS 投稿）

---

## 11. 免責事項

- プレミアム機能は現在「テスト用トグル」として実装されています。本番リリースに際しては購入・認証フローの追加が必要です。
- 広告視聴によるライフ回復は、実際の広告 SDK なしの疑似体験です。マネタイズ戦略に応じて差し替えてください。

---

*本書は AI によって整理・構成されたドキュメントです。実装の正確な詳細については、添付のソースコードおよび `package.json`、`src-tauri/tauri.conf.json` を参照してください。*
