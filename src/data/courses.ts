import type { Course, Material } from '../types';

export const courses: Course[] = [
  {
    id: 'jhs',
    title: '中学英語コース',
    description: '中学レベルの基本文で英語の土台を作ろう',
    icon: '📗',
    color: '#22c55e',
    units: [
      {
        id: 'jhs-u1',
        title: 'ユニット1: 日常のきほん',
        lessons: [
          { id: 'jhs-1-1', en: 'I get up at seven every morning.', ja: '私は毎朝7時に起きます。', category: 'daily', difficulty: 'easy', words: [{ en: 'get up', ja: '起きる' }, { en: 'every morning', ja: '毎朝' }] },
          { id: 'jhs-1-2', en: 'She likes to play tennis after school.', ja: '彼女は放課後にテニスをするのが好きです。', category: 'daily', difficulty: 'easy', words: [{ en: 'after school', ja: '放課後' }, { en: 'like to', ja: '〜するのが好き' }] },
          { id: 'jhs-1-3', en: 'We have lunch at noon in the cafeteria.', ja: '私たちは正午に食堂で昼食をとります。', category: 'daily', difficulty: 'easy', words: [{ en: 'noon', ja: '正午' }, { en: 'cafeteria', ja: '食堂' }] },
          { id: 'jhs-1-4', en: 'My brother is watching TV in his room.', ja: '兄は自分の部屋でテレビを見ています。', category: 'daily', difficulty: 'easy', words: [{ en: 'be watching', ja: '見ているところ（現在進行形）' }] },
          { id: 'jhs-1-5', en: 'There are many books on the desk.', ja: '机の上にたくさんの本があります。', category: 'daily', difficulty: 'easy', words: [{ en: 'there are', ja: '〜がある（複数）' }, { en: 'many', ja: 'たくさんの' }] },
        ],
      },
      {
        id: 'jhs-u2',
        title: 'ユニット2: 過去と未来',
        lessons: [
          { id: 'jhs-2-1', en: 'I went to the library yesterday.', ja: '私は昨日図書館に行きました。', category: 'grammar', difficulty: 'easy', words: [{ en: 'went', ja: 'goの過去形' }, { en: 'library', ja: '図書館' }] },
          { id: 'jhs-2-2', en: 'He did not do his homework last night.', ja: '彼は昨夜宿題をしませんでした。', category: 'grammar', difficulty: 'easy', words: [{ en: 'did not', ja: '〜しなかった' }, { en: 'homework', ja: '宿題' }] },
          { id: 'jhs-2-3', en: 'We are going to visit Kyoto next month.', ja: '私たちは来月京都を訪れる予定です。', category: 'grammar', difficulty: 'medium', words: [{ en: 'be going to', ja: '〜する予定' }, { en: 'visit', ja: '訪れる' }] },
          { id: 'jhs-2-4', en: 'It will be sunny tomorrow.', ja: '明日は晴れるでしょう。', category: 'grammar', difficulty: 'easy', words: [{ en: 'will', ja: '〜だろう（未来）' }, { en: 'sunny', ja: '晴れた' }] },
          { id: 'jhs-2-5', en: 'She was reading a book when I called her.', ja: '私が電話したとき、彼女は本を読んでいました。', category: 'grammar', difficulty: 'medium', words: [{ en: 'was reading', ja: '読んでいた（過去進行形）' }, { en: 'call', ja: '電話する' }] },
        ],
      },
    ],
  },
  {
    id: 'hs',
    title: '高校英語コース',
    description: '受験にも役立つ文法・構文をマスターしよう',
    icon: '📘',
    color: '#3b82f6',
    units: [
      {
        id: 'hs-u1',
        title: 'ユニット1: 重要文法',
        lessons: [
          { id: 'hs-1-1', en: 'I have never seen such a beautiful sunset.', ja: 'こんなに美しい夕日は見たことがありません。', category: 'highschool', difficulty: 'medium', words: [{ en: 'have never seen', ja: '見たことがない（現在完了）' }, { en: 'sunset', ja: '夕日' }] },
          { id: 'hs-1-2', en: 'The book written by him is very popular.', ja: '彼によって書かれた本はとても人気があります。', category: 'highschool', difficulty: 'medium', words: [{ en: 'written by', ja: '〜によって書かれた（過去分詞）' }, { en: 'popular', ja: '人気のある' }] },
          { id: 'hs-1-3', en: 'If I were you, I would ask the teacher for help.', ja: 'もし私があなたなら、先生に助けを求めるでしょう。', category: 'highschool', difficulty: 'hard', words: [{ en: 'if I were you', ja: 'もし私があなたなら（仮定法）' }, { en: 'ask for help', ja: '助けを求める' }] },
          { id: 'hs-1-4', en: 'It is important for us to keep learning.', ja: '学び続けることは私たちにとって重要です。', category: 'highschool', difficulty: 'medium', words: [{ en: 'it is ... for ... to', ja: '〜することは…にとって〜だ' }, { en: 'keep learning', ja: '学び続ける' }] },
          { id: 'hs-1-5', en: 'The man whom I met at the station was kind.', ja: '駅で会った男性は親切でした。', category: 'highschool', difficulty: 'hard', words: [{ en: 'whom', ja: '関係代名詞（目的格）' }, { en: 'kind', ja: '親切な' }] },
        ],
      },
      {
        id: 'hs-u2',
        title: 'ユニット2: 表現力アップ',
        lessons: [
          { id: 'hs-2-1', en: 'Not only students but also teachers enjoyed the festival.', ja: '生徒だけでなく先生たちも文化祭を楽しみました。', category: 'highschool', difficulty: 'hard', words: [{ en: 'not only A but also B', ja: 'AだけでなくBも' }, { en: 'festival', ja: '祭り' }] },
          { id: 'hs-2-2', en: 'The harder you study, the more you understand.', ja: '一生懸命勉強すればするほど、より理解できます。', category: 'highschool', difficulty: 'hard', words: [{ en: 'the 比較級, the 比較級', ja: '〜すればするほど…' }] },
          { id: 'hs-2-3', en: 'He speaks English as if he were a native speaker.', ja: '彼はまるでネイティブのように英語を話します。', category: 'highschool', difficulty: 'hard', words: [{ en: 'as if', ja: 'まるで〜のように' }, { en: 'native speaker', ja: '母語話者' }] },
          { id: 'hs-2-4', en: 'I wish I could travel around the world.', ja: '世界中を旅できたらいいのに。', category: 'highschool', difficulty: 'medium', words: [{ en: 'I wish', ja: '〜だったらいいのに（仮定法）' }, { en: 'around the world', ja: '世界中を' }] },
          { id: 'hs-2-5', en: 'Having finished the report, she went home early.', ja: 'レポートを終えたので、彼女は早く帰宅しました。', category: 'highschool', difficulty: 'hard', words: [{ en: 'having finished', ja: '〜し終えて（分詞構文）' }, { en: 'go home', ja: '帰宅する' }] },
        ],
      },
    ],
  },
  {
    id: 'toeic',
    title: 'TOEICコース',
    description: 'ビジネス頻出表現でスコアアップを狙おう',
    icon: '💼',
    color: '#f59e0b',
    units: [
      {
        id: 'toeic-u1',
        title: 'ユニット1: オフィス表現',
        lessons: [
          { id: 'toeic-1-1', en: 'Please submit the report by the end of the day.', ja: '本日中に報告書を提出してください。', category: 'toeic', difficulty: 'medium', words: [{ en: 'submit', ja: '提出する' }, { en: 'by the end of the day', ja: '今日中に' }] },
          { id: 'toeic-1-2', en: 'The meeting has been rescheduled to Monday.', ja: '会議は月曜日に変更されました。', category: 'toeic', difficulty: 'medium', words: [{ en: 'reschedule', ja: '予定を変更する' }] },
          { id: 'toeic-1-3', en: 'She is in charge of the marketing department.', ja: '彼女はマーケティング部門の責任者です。', category: 'toeic', difficulty: 'medium', words: [{ en: 'in charge of', ja: '〜の担当・責任者' }, { en: 'department', ja: '部門' }] },
          { id: 'toeic-1-4', en: 'We apologize for any inconvenience this may cause.', ja: 'ご迷惑をおかけして申し訳ございません。', category: 'toeic', difficulty: 'hard', words: [{ en: 'apologize for', ja: '〜を謝罪する' }, { en: 'inconvenience', ja: '不便・迷惑' }] },
          { id: 'toeic-1-5', en: 'The new employee will attend the training session.', ja: '新入社員は研修に参加します。', category: 'toeic', difficulty: 'medium', words: [{ en: 'employee', ja: '従業員' }, { en: 'attend', ja: '参加する' }] },
        ],
      },
      {
        id: 'toeic-u2',
        title: 'ユニット2: ビジネス実践',
        lessons: [
          { id: 'toeic-2-1', en: 'The shipment was delayed due to bad weather.', ja: '悪天候のため出荷が遅れました。', category: 'toeic', difficulty: 'medium', words: [{ en: 'shipment', ja: '出荷' }, { en: 'due to', ja: '〜のため' }] },
          { id: 'toeic-2-2', en: 'All applicants must have relevant work experience.', ja: '応募者は全員、関連する職務経験が必要です。', category: 'toeic', difficulty: 'hard', words: [{ en: 'applicant', ja: '応募者' }, { en: 'relevant', ja: '関連する' }] },
          { id: 'toeic-2-3', en: 'Our sales figures exceeded expectations this quarter.', ja: '今四半期の売上高は予想を上回りました。', category: 'toeic', difficulty: 'hard', words: [{ en: 'exceed', ja: '上回る' }, { en: 'quarter', ja: '四半期' }] },
          { id: 'toeic-2-4', en: 'Please review the attached document before the meeting.', ja: '会議の前に添付書類をご確認ください。', category: 'toeic', difficulty: 'medium', words: [{ en: 'review', ja: '確認する' }, { en: 'attached', ja: '添付された' }] },
          { id: 'toeic-2-5', en: 'The company plans to expand into overseas markets.', ja: 'その会社は海外市場への進出を計画しています。', category: 'toeic', difficulty: 'hard', words: [{ en: 'expand into', ja: '〜へ進出する' }, { en: 'overseas', ja: '海外の' }] },
        ],
      },
    ],
  },
];

export const allCourseMaterials: Material[] = courses.flatMap((c) => c.units.flatMap((u) => u.lessons));

export function getCourse(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId);
}

export function findCourseMaterial(materialId: string): Material | undefined {
  return allCourseMaterials.find((m) => m.id === materialId);
}
