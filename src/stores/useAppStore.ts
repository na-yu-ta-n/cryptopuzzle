import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Material, CipherPuzzle, Guesses, Stats, Settings, Screen, SolvedRecord, SessionInfo, SrsItem } from '../types';
import { createCipher, calculateXp } from '../utils/cipher';
import {
  MAX_LIVES,
  PUZZLE_START_COST,
  HINT_COST,
  AD_LIFE_REWARD,
  rechargedLives,
  updatedLastLifeUpdate,
} from '../utils/life';
import { tauriStorage } from '../utils/storage';
import { sounds } from '../utils/sound';
import { haptic } from '../utils/haptic';
import { getNewBadges } from '../utils/badges';
import { scheduleFirstReview, advanceSrs } from '../utils/srs';
import { today } from '../utils/date';
import { updateStreak } from '../utils/stats';
import {
  allMaterials,
  filteredMaterials,
  getDailyMaterial,
  getDueReviewMaterials,
  nextLessonInCourse,
} from '../utils/materials';
import { findNextSymbol, getHintCount, isPuzzleComplete } from '../utils/puzzle';

export const DEFAULT_STATS: Stats = {
  xp: 0,
  level: 1,
  totalSolved: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSolvedDate: null,
  monthlySolved: {},
  badges: [],
  history: [],
};

export const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  animationsEnabled: true,
  selectedCategory: 'all',
  puzzleDifficulty: 'superEasy',
  premium: false,
};

interface AppState {
  stats: Stats;
  settings: Settings;
  customMaterials: Material[];
  puzzle: CipherPuzzle | null;
  guesses: Guesses;
  selectedSymbol: string | null;
  mistakes: number;
  combo: number;
  won: boolean;
  newBadges: string[];
  isHydrated: boolean;
  screen: Screen;
  xpPopup: number | null;
  shake: boolean;
  levelUp: boolean;
  session: SessionInfo;
  courseProgress: Record<string, string[]>; // courseId -> completed material ids
  srs: Record<string, SrsItem>; // materialId -> review item
  dailyDoneDate: string | null;
  selectedCourseId: string | null;
  lives: number;
  maxLives: number;
  lastLifeUpdate: number;
  snackbar: { open: boolean, message: string };

  setHydrated: (hydrated: boolean) => void;
  startPuzzle: (material?: Material) => void;
  startRandom: () => void;
  startLesson: (courseId: string, unitId: string, material: Material) => void;
  startNextLesson: () => void;
  startDaily: () => void;
  startReview: (material: Material) => void;
  startNextReview: () => void;
  selectSymbol: (symbol: string | null) => void;
  setGuess: (letter: string) => void;
  clearGuess: () => void;
  useHint: () => void;
  claimAdLives: () => void;
  importMaterials: (data: unknown) => { ok: boolean, message: string };
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetProgress: () => void;
  setScreen: (screen: Screen) => void;
  setSelectedCourseId: (id: string | null) => void;
  clearXpPopup: () => void;
  clearShake: () => void;
  clearLevelUp: () => void;
  tickLives: () => void;
  closeSnackbar: () => void;
}



const NO_LIVES_MESSAGE = 'ライフが足りません。動画を見て回復しましょう。';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      // 共通のパズル開始処理
      const beginPuzzle = (material: Material, session: SessionInfo) => {
        const puzzle = createCipher(material);
        const guesses: Guesses = {};
        for (const sym of puzzle.usedSymbols) guesses[sym] = null;

        // Starting hints based on difficulty
        const hintCount = getHintCount(get().settings.puzzleDifficulty, puzzle.usedSymbols.length);
        const shuffled = [...puzzle.usedSymbols].sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(hintCount, shuffled.length); i++) {
          const sym = shuffled[i];
          guesses[sym] = puzzle.reverseMapping[sym];
        }

        const firstEmpty = puzzle.usedSymbols.find((s) => guesses[s] == null) ?? puzzle.usedSymbols[0] ?? null;

        set({
          puzzle,
          guesses,
          selectedSymbol: firstEmpty,
          mistakes: 0,
          combo: 0,
          won: false,
          newBadges: [],
          screen: 'play',
          xpPopup: null,
          shake: false,
          levelUp: false,
          session,
        });
        sounds.click(get().settings.soundEnabled);
      };

      // 共通のクリア処理（XP計算・SRS登録・コース進捗・デイリー・バッジ）
      const completeWin = (updatedGuesses: Guesses, mistakesTotal: number, newCombo: number, xpPenalty: number) => {
        const state = get();
        if (!state.puzzle) return;
        const material = state.puzzle.material;
        const session = state.session;
        const baseXp = Math.max(1, calculateXp(material, mistakesTotal) - xpPenalty);
        const comboBonus = newCombo * 3;
        let xp = baseXp + comboBonus;
        if (session.type === 'daily') xp *= 2; // デイリーチャレンジは2倍XP
        if (session.type === 'review') xp += 5; // 復習ボーナス
        const oldLevel = state.stats.level;
        const stats = updateStreak({ ...state.stats });
        stats.xp += xp;
        stats.level = Math.floor(stats.xp / 100) + 1;
        stats.totalSolved += 1;
        const record: SolvedRecord = {
          materialId: material.id,
          date: today(),
          xp,
          attempts: mistakesTotal,
        };
        const nextHistory = [record, ...state.stats.history.filter((h) => h.materialId !== record.materialId)];
        stats.history = nextHistory.slice(0, 500);
        const newBadgeIds = getNewBadges(stats);
        if (newBadgeIds.length > 0) {
          stats.badges = [...stats.badges, ...newBadgeIds];
          sounds.badge(state.settings.soundEnabled);
          haptic([40, 40, 40, 40]);
        }
        const didLevelUp = stats.level > oldLevel;
        if (didLevelUp) {
          sounds.levelUp(state.settings.soundEnabled);
          haptic([50, 30, 50, 30, 50]);
        } else {
          sounds.win(state.settings.soundEnabled);
          haptic([50, 30, 50]);
        }

        // SRSスケジュール更新
        const srs = { ...state.srs };
        if (session.type === 'review' && srs[material.id]) {
          srs[material.id] = advanceSrs(srs[material.id]);
        } else if (!srs[material.id]) {
          srs[material.id] = scheduleFirstReview(material.id);
        }

        // コース進捗更新
        let courseProgress = state.courseProgress;
        if (session.type === 'lesson' && session.courseId) {
          const done = courseProgress[session.courseId] ?? [];
          if (!done.includes(material.id)) {
            courseProgress = { ...courseProgress, [session.courseId]: [...done, material.id] };
          }
        }

        set({
          guesses: updatedGuesses,
          mistakes: mistakesTotal,
          combo: newCombo,
          won: true,
          stats,
          newBadges: newBadgeIds,
          xpPopup: xp,
          screen: 'play',
          shake: false,
          levelUp: didLevelUp,
          srs,
          courseProgress,
          dailyDoneDate: session.type === 'daily' ? today() : state.dailyDoneDate,
        });
      };

      const tickLives = () => {
        const now = Date.now();
        const state = get();
        if (state.settings.premium) {
          if (state.lives !== MAX_LIVES) {
            set({ lives: MAX_LIVES, lastLifeUpdate: now });
          }
          return;
        }
        const recharged = rechargedLives(state.lives, state.lastLifeUpdate, now);
        if (recharged === state.lives) return;
        const nextUpdate = recharged >= MAX_LIVES ? now : updatedLastLifeUpdate(state.lives, state.lastLifeUpdate, now);
        set({ lives: recharged, lastLifeUpdate: nextUpdate });
      };

      const consumeLives = (cost: number): boolean => {
        if (get().settings.premium) return true;
        tickLives();
        const current = get().lives;
        if (current < cost) return false;
        set({ lives: current - cost });
        return true;
      };

      const showSnackbar = (message: string) => {
        set({ snackbar: { open: true, message } });
      };

      const payForPuzzle = () => {
        if (!consumeLives(PUZZLE_START_COST)) {
          showSnackbar(NO_LIVES_MESSAGE);
          return false;
        }
        return true;
      };

      return {
        stats: DEFAULT_STATS,
        settings: DEFAULT_SETTINGS,
        customMaterials: [],
        puzzle: null,
        guesses: {},
        selectedSymbol: null,
        mistakes: 0,
        combo: 0,
        won: false,
        newBadges: [],
        isHydrated: false,
        screen: 'start',
        xpPopup: null,
        shake: false,
        levelUp: false,
        session: { type: 'free' },
        courseProgress: {},
        srs: {},
        dailyDoneDate: null,
        selectedCourseId: null,
        lives: MAX_LIVES,
        maxLives: MAX_LIVES,
        lastLifeUpdate: Date.now(),
        snackbar: { open: false, message: '' },

        setHydrated: (hydrated) => set({ isHydrated: hydrated }),

        tickLives,

        startPuzzle: (material) => {
          if (!payForPuzzle()) return;
          const state = get();
          const pool = filteredMaterials(state.customMaterials, state.settings.selectedCategory);
          const chosen = material ?? pool[Math.floor(Math.random() * pool.length)] ?? allMaterials(state.customMaterials)[0];
          beginPuzzle(chosen, { type: 'free' });
        },

        startRandom: () => {
          if (!payForPuzzle()) return;
          const state = get();
          const pool = filteredMaterials(state.customMaterials, state.settings.selectedCategory);
          if (pool.length === 0) return;
          // avoid same material if possible
          const others = state.puzzle ? pool.filter((m) => m.id !== state.puzzle?.material.id) : pool;
          const chosen = others.length > 0 ? others[Math.floor(Math.random() * others.length)] : pool[Math.floor(Math.random() * pool.length)];
          beginPuzzle(chosen, { type: 'free' });
        },

        startLesson: (courseId, unitId, material) => {
          if (!payForPuzzle()) return;
          beginPuzzle(material, { type: 'lesson', courseId, unitId });
        },

        startNextLesson: () => {
          const state = get();
          const courseId = state.session.courseId;
          if (!courseId) return;
          const next = nextLessonInCourse(courseId, state.courseProgress[courseId] ?? []);
          if (next) {
            if (!payForPuzzle()) return;
            beginPuzzle(next.material, { type: 'lesson', courseId, unitId: next.unitId });
          } else {
            set({ screen: 'courses' });
          }
        },

        startDaily: () => {
          if (!payForPuzzle()) return;
          beginPuzzle(getDailyMaterial(), { type: 'daily' });
        },

        startReview: (material) => {
          if (!payForPuzzle()) return;
          beginPuzzle(material, { type: 'review' });
        },

        startNextReview: () => {
          const state = get();
          const due = getDueReviewMaterials(state.customMaterials, state.srs).filter((m) => m.id !== state.puzzle?.material.id);
          if (due.length > 0) {
            if (!payForPuzzle()) return;
            beginPuzzle(due[0], { type: 'review' });
          } else {
            set({ screen: 'review' });
          }
        },

        selectSymbol: (symbol) => {
          if (!symbol) return;
          sounds.click(get().settings.soundEnabled);
          set({ selectedSymbol: symbol, shake: false });
        },

        setGuess: (letter) => {
          const state = get();
          if (!state.puzzle || !state.selectedSymbol || state.won) return;
          const upper = letter.toUpperCase();
          if (!/^[A-Z]$/.test(upper)) return;

          // 既に他の暗号文字に割り当てられている場合はそちらを解除
          const existingSymbol = Object.entries(state.guesses).find(
            ([sym, guess]) => guess === upper && sym !== state.selectedSymbol,
          )?.[0];
          const updated: Guesses = { ...state.guesses, [state.selectedSymbol]: upper };
          if (existingSymbol) {
            updated[existingSymbol] = null;
          }

          const correct = state.puzzle.reverseMapping[state.selectedSymbol];
          const isCorrect = upper === correct;

          if (isCorrect) {
            sounds.correct(state.settings.soundEnabled);
            if (state.combo > 0 && state.combo % 5 === 0) {
              sounds.combo(state.settings.soundEnabled, state.combo + 1);
            }
            haptic(30);
          } else {
            sounds.wrong(state.settings.soundEnabled);
            haptic([60, 30, 60]);
          }

          if (isPuzzleComplete(updated, state.puzzle)) {
            const mistakesTotal = state.mistakes + (isCorrect ? 0 : 1);
            const newCombo = isCorrect ? state.combo + 1 : 0;
            completeWin(updated, mistakesTotal, newCombo, 0);
            return;
          }

          set({
            guesses: updated,
            mistakes: isCorrect ? state.mistakes : state.mistakes + 1,
            combo: isCorrect ? state.combo + 1 : 0,
            shake: !isCorrect,
            selectedSymbol: findNextSymbol(state.puzzle, updated, state.selectedSymbol),
          });
        },

        clearGuess: () => {
          const state = get();
          if (!state.puzzle || !state.selectedSymbol || state.won) return;
          const updated = { ...state.guesses, [state.selectedSymbol]: null };
          set({ guesses: updated });
        },

        useHint: () => {
          const state = get();
          if (!state.puzzle || state.won) return;
          if (!consumeLives(HINT_COST)) {
            showSnackbar(NO_LIVES_MESSAGE);
            return;
          }
          const incorrectOrEmpty = state.puzzle.usedSymbols.filter(
            (s) => state.guesses[s] !== state.puzzle?.reverseMapping[s],
          );
          if (incorrectOrEmpty.length === 0) return;
          const sym = incorrectOrEmpty[Math.floor(Math.random() * incorrectOrEmpty.length)];
          const correct = state.puzzle.reverseMapping[sym];
          const updated = { ...state.guesses, [sym]: correct };
          set({ guesses: updated, mistakes: state.mistakes + 1 });
          sounds.click(state.settings.soundEnabled);
          haptic(20);

          if (isPuzzleComplete(updated, state.puzzle)) {
            completeWin(updated, state.mistakes + 1, get().combo, 5);
          }
        },

        claimAdLives: () => {
          tickLives();
          const state = get();
          const nextLives = Math.min(MAX_LIVES, state.lives + AD_LIFE_REWARD);
          const nextUpdate = nextLives >= MAX_LIVES ? Date.now() : state.lastLifeUpdate;
          set({ lives: nextLives, lastLifeUpdate: nextUpdate });
          sounds.badge(state.settings.soundEnabled);
          haptic([30, 30, 30]);
        },

        closeSnackbar: () => set({ snackbar: { open: false, message: '' } }),

        importMaterials: (data) => {
          try {
            const parsed = Array.isArray(data) ? data : [data];
            const usedIds = new Set(
              allMaterials(get().customMaterials).map((m) => m.id),
            );
            const valid: Material[] = [];
            for (const item of parsed) {
              if (typeof item === 'object' && item !== null && 'en' in item && 'ja' in item) {
                let id = (item as { id?: string }).id ?? crypto.randomUUID();
                if (usedIds.has(id)) {
                  id = crypto.randomUUID();
                }
                usedIds.add(id);
                valid.push({
                  id,
                  en: String((item as { en: unknown }).en),
                  ja: String((item as { ja: unknown }).ja),
                  category: ((item as { category?: string }).category as Material['category']) ?? 'custom',
                  difficulty: ((item as { difficulty?: string }).difficulty as Material['difficulty']) ?? 'medium',
                  hint: (item as { hint?: string }).hint,
                });
              }
            }
            if (valid.length === 0) return { ok: false, message: '有効な教材データが見つかりませんでした' };
            set({ customMaterials: [...get().customMaterials, ...valid] });
            return { ok: true, message: `${valid.length}件の教材を追加しました` };
          } catch (err) {
            return { ok: false, message: String(err) };
          }
        },

        setSetting: (key, value) => {
          set((s) => ({ settings: { ...s.settings, [key]: value } }));
        },

        resetProgress: () => {
          set({ stats: DEFAULT_STATS, customMaterials: [], courseProgress: {}, srs: {}, dailyDoneDate: null });
        },

        setScreen: (screen) => set({ screen }),
        setSelectedCourseId: (id) => set({ selectedCourseId: id }),
        clearXpPopup: () => set({ xpPopup: null }),
        clearShake: () => set({ shake: false }),
        clearLevelUp: () => set({ levelUp: false }),
      };
    },
    {
      name: 'cryptopuzzle-store',
      storage: createJSONStorage(() => tauriStorage),
      partialize: (state) => ({
        stats: state.stats,
        settings: state.settings,
        customMaterials: state.customMaterials,
        courseProgress: state.courseProgress,
        srs: state.srs,
        dailyDoneDate: state.dailyDoneDate,
        lives: state.lives,
        lastLifeUpdate: state.lastLifeUpdate,
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (!error && state) {
            (state as AppState).setHydrated(true);
          }
        };
      },
    }
  )
);


