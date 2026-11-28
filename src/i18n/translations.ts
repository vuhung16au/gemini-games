import type { CategoryFilter } from '../registry/games';

export type Locale = 'en' | 'zh' | 'vi';

export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'zh', 'vi'] as const;

export interface LocaleOption {
  code: Locale;
  shortLabel: string;
  nativeName: string;
}

export const LOCALE_OPTIONS: readonly LocaleOption[] = [
  { code: 'en', shortLabel: 'EN', nativeName: 'English' },
  { code: 'zh', shortLabel: '中文', nativeName: '中文' },
  { code: 'vi', shortLabel: 'VI', nativeName: 'Tiếng Việt' },
];

export type HubTabFilter = CategoryFilter | 'Favorites';

export interface HubTranslations {
  appTitle: string;
  gamesCount: (count: number) => string;
  subtitlePrefix: string;
  subtitleSearchKey: string;
  subtitleMiddle: string;
  subtitleArrowKeys: string;
  subtitlePlus: string;
  subtitleEnterKey: string;
  subtitleSuffix: string;
  lightMode: string;
  darkMode: string;
  languageAriaLabel: string;
  categoriesAriaLabel: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
  recentlyPlayed: string;
  emptyFavorites: string;
  emptyFilter: string;
  resetFilters: string;
  gamesGridAriaLabel: string;
  openGameAria: (title: string) => string;
  addFavoriteAria: (title: string) => string;
  removeFavoriteAria: (title: string) => string;
  playButton: string;
  allGamesBack: string;
  reloadGame: string;
  fullscreen: string;
  footerAriaLabel: string;
  footerLinks: {
    projectRepo: string;
    authorGithub: string;
    linkedin: string;
    substack: string;
    vumaths: string;
  };
  categories: Record<HubTabFilter, string>;
}

export const HUB_TRANSLATIONS: Record<Locale, HubTranslations> = {
  en: {
    appTitle: 'Gemini Games',
    gamesCount: (count) => `${count} Games`,
    subtitlePrefix:
      'Play all arcade, puzzle, board, card, and tycoon games in one unified hub. Press ',
    subtitleSearchKey: '/',
    subtitleMiddle: ' to search or ',
    subtitleArrowKeys: 'Arrow keys',
    subtitlePlus: ' + ',
    subtitleEnterKey: 'Enter',
    subtitleSuffix: ' to launch.',
    lightMode: '☀ Light',
    darkMode: '🌙 Dark',
    languageAriaLabel: 'Select language',
    categoriesAriaLabel: 'Game categories',
    searchPlaceholder: 'Search games… (/)',
    searchAriaLabel: 'Search games',
    recentlyPlayed: 'RECENTLY PLAYED',
    emptyFavorites:
      'No favorite games yet. Click the ★ on any game card to pin it here!',
    emptyFilter: 'No games match your current filter.',
    resetFilters: 'Reset Filters',
    gamesGridAriaLabel: 'Games grid',
    openGameAria: (title) => `Open ${title}`,
    addFavoriteAria: (title) => `Add ${title} to favorites`,
    removeFavoriteAria: (title) => `Remove ${title} from favorites`,
    playButton: 'Play',
    allGamesBack: '← All Games',
    reloadGame: '↻ Reload',
    fullscreen: '⛶ Fullscreen',
    footerAriaLabel: 'Project and author links',
    footerLinks: {
      projectRepo: 'Project GitHub',
      authorGithub: 'GitHub (@vuhung16au)',
      linkedin: 'LinkedIn',
      substack: 'Substack',
      vumaths: 'VuMaths',
    },
    categories: {
      All: 'All',
      Favorites: 'Favorites',
      Puzzle: 'Puzzle',
      Board: 'Board',
      Arcade: 'Arcade',
      Simulation: 'Simulation',
      Card: 'Card',
    },
  },
  zh: {
    appTitle: 'Gemini 游戏中心',
    gamesCount: (count) => `${count} 款游戏`,
    subtitlePrefix:
      '在一个统一中心畅玩街机、益智、棋类、卡牌与模拟经营游戏。按 ',
    subtitleSearchKey: '/',
    subtitleMiddle: ' 搜索，或用 ',
    subtitleArrowKeys: '方向键',
    subtitlePlus: ' + ',
    subtitleEnterKey: 'Enter',
    subtitleSuffix: ' 启动游戏。',
    lightMode: '☀ 浅色',
    darkMode: '🌙 深色',
    languageAriaLabel: '选择语言',
    categoriesAriaLabel: '游戏分类',
    searchPlaceholder: '搜索游戏… (/)',
    searchAriaLabel: '搜索游戏',
    recentlyPlayed: '最近游玩',
    emptyFavorites: '暂无收藏游戏。点击任意游戏卡片上的 ☆ 即可收藏！',
    emptyFilter: '没有符合当前筛选条件的游戏。',
    resetFilters: '重置筛选',
    gamesGridAriaLabel: '游戏列表',
    openGameAria: (title) => `打开 ${title}`,
    addFavoriteAria: (title) => `收藏 ${title}`,
    removeFavoriteAria: (title) => `取消收藏 ${title}`,
    playButton: '开始游戏',
    allGamesBack: '← 全部游戏',
    reloadGame: '↻ 重新加载',
    fullscreen: '⛶ 全屏',
    footerAriaLabel: '项目与作者链接',
    footerLinks: {
      projectRepo: '项目 GitHub',
      authorGithub: 'GitHub (@vuhung16au)',
      linkedin: 'LinkedIn',
      substack: 'Substack',
      vumaths: 'VuMaths',
    },
    categories: {
      All: '全部',
      Favorites: '收藏',
      Puzzle: '益智',
      Board: '棋类',
      Arcade: '街机',
      Simulation: '模拟',
      Card: '卡牌',
    },
  },
  vi: {
    appTitle: 'Gemini Games',
    gamesCount: (count) => `${count} Trò chơi`,
    subtitlePrefix:
      'Chơi toàn bộ game arcade, giải đố, cờ, bài và mô phỏng trong một trung tâm thống nhất. Nhấn ',
    subtitleSearchKey: '/',
    subtitleMiddle: ' để tìm kiếm hoặc ',
    subtitleArrowKeys: 'Phím mũi tên',
    subtitlePlus: ' + ',
    subtitleEnterKey: 'Enter',
    subtitleSuffix: ' để mở.',
    lightMode: '☀ Sáng',
    darkMode: '🌙 Tối',
    languageAriaLabel: 'Chọn ngôn ngữ',
    categoriesAriaLabel: 'Danh mục trò chơi',
    searchPlaceholder: 'Tìm trò chơi… (/)',
    searchAriaLabel: 'Tìm trò chơi',
    recentlyPlayed: 'CHƠI GẦN ĐÂY',
    emptyFavorites:
      'Chưa có trò chơi yêu thích. Nhấn ☆ trên thẻ trò chơi bất kỳ để ghim vào đây!',
    emptyFilter: 'Không có trò chơi nào khớp với bộ lọc hiện tại.',
    resetFilters: 'Đặt lại bộ lọc',
    gamesGridAriaLabel: 'Danh sách trò chơi',
    openGameAria: (title) => `Mở ${title}`,
    addFavoriteAria: (title) => `Thêm ${title} vào yêu thích`,
    removeFavoriteAria: (title) => `Bỏ ${title} khỏi yêu thích`,
    playButton: 'Chơi ngay',
    allGamesBack: '← Tất cả trò chơi',
    reloadGame: '↻ Tải lại',
    fullscreen: '⛶ Toàn màn hình',
    footerAriaLabel: 'Liên kết dự án và tác giả',
    footerLinks: {
      projectRepo: 'GitHub dự án',
      authorGithub: 'GitHub (@vuhung16au)',
      linkedin: 'LinkedIn',
      substack: 'Substack',
      vumaths: 'VuMaths',
    },
    categories: {
      All: 'Tất cả',
      Favorites: 'Yêu thích',
      Puzzle: 'Giải đố',
      Board: 'Cờ',
      Arcade: 'Arcade',
      Simulation: 'Mô phỏng',
      Card: 'Đánh bài',
    },
  },
};

export interface LocalizedGameText {
  title: string;
  description: string;
  controls: string;
}

export const GAME_LOCALIZATIONS: Record<
  string,
  Partial<Record<Locale, LocalizedGameText>>
> = {
  '1024': {
    zh: {
      title: '1024 数字合成',
      description: '滑动并合并相同数字方块，从 1 一路合成到 1024。',
      controls: '方向键 / WASD / 滑动',
    },
    vi: {
      title: '1024',
      description:
        'Trượt và ghép các ô số giống nhau từ 1 để đạt tới ô 1024.',
      controls: 'Mũi tên / WASD / Vuốt',
    },
  },
  'battle-city': {
    zh: {
      title: '坦克大战 1985',
      description:
        '经典 1985 FC 坦克大战，支持单人及双人本地合作、可破坏砖墙与 10 个关卡。',
      controls: '1P: WASD+空格 · 2P: 方向键+回车',
    },
    vi: {
      title: 'Battle City 1985 (Bắn Tăng)',
      description:
        'Tựa game bắn tăng 1985 kinh điển với chế độ 1–2 người chơi, tường gạch phá hủy được và 10 màn chơi.',
      controls: 'P1: WASD+Space · P2: Mũi tên+Enter',
    },
  },
  checkers: {
    zh: {
      title: '国际跳棋',
      description: '经典 8×8 美式跳棋，支持 AI 对战、双人对战和连续跳吃。',
      controls: '点击 / 轻触',
    },
    vi: {
      title: 'Cờ Đam (Checkers)',
      description:
        'Cờ đam Mỹ 8×8 cổ điển với AI, chế độ 2 người chơi và ăn quân liên hoàn.',
      controls: 'Nhấp / Chạm',
    },
  },
  'cozy-town-tycoon': {
    zh: {
      title: '温馨小镇大亨',
      description: '烘焙糕点、服务镇民、雇佣员工并扩展你的像素风面包店。',
      controls: '点击 / 轻触',
    },
    vi: {
      title: 'Ông Trùm Thị Trấn Ấm Áp',
      description:
        'Nướng bánh ngọt, phục vụ dân làng, thuê nhân viên và mở rộng tiệm bánh pixel của bạn.',
      controls: 'Nhấp / Chạm',
    },
  },
  'dino-run': {
    zh: {
      title: '恐龙快跑',
      description:
        'Chrome 离线 404 小恐龙跑酷，包含经典沙漠与 404 数学证明跑酷模式。',
      controls: '空格 / 上键跳跃 · 下键蹲伏',
    },
    vi: {
      title: 'Khủng Long Chạy Bộ (Dino Run)',
      description:
        'Trò chơi khủng long 404 Chrome với chế độ Sa Mạc Cổ Điển và 404 Chứng Minh Toán Học.',
      controls: 'Space / Lên để nhảy · Xuống để cúi',
    },
  },
  'flappy-bird': {
    zh: {
      title: '像素飞鸟',
      description: '轻点或按空格键控制小鸟飞跃越来越窄的街机管道。',
      controls: '空格 / 上键 / 点击',
    },
    vi: {
      title: 'Flappy Bird',
      description:
        'Chạm hoặc nhấn Space để bay qua các ống cống ngày càng hẹp.',
      controls: 'Space / Lên / Chạm',
    },
  },
  minesweeper: {
    zh: {
      title: '扫雷',
      description:
        '经典逻辑扫雷益智游戏，支持初级、中级、高级与自定义棋盘尺寸。',
      controls: '左键翻开 / 右键插旗 / 双击快开',
    },
    vi: {
      title: 'Dò Mìn (Minesweeper)',
      description:
        'Trò chơi giải đố dò mìn kinh điển với mức Dễ, Trung bình, Khó và kích thước bàn tùy chỉnh.',
      controls: 'Nhấp trái / Nhấp phải cắm cờ / Mở nhanh',
    },
  },
  simcity: {
    zh: {
      title: '模拟城市 3D',
      description:
        '打造鲜活的低多边形 3D 都市，规划住宅商业工业区、桥梁、水电与昼夜光影。',
      controls: '点击 / 拖拽 / 旋转视角 / WASD / 1–9',
    },
    vi: {
      title: 'SimCity 3D',
      description:
        'Xây dựng đô thị 3D low-poly sống động với quy hoạch RCI, cầu đường, điện nước và chu kỳ ngày/đêm.',
      controls: 'Nhấp / Kéo / Xoay / WASD / 1–9',
    },
  },
  solitaire: {
    zh: {
      title: '纸牌接龙',
      description: '经典克朗代克纸牌接龙，支持翻 1/3 张模式、智能提示与教学。',
      controls: '点击 / 拖拽 / 双击',
    },
    vi: {
      title: 'Bài Solitaire',
      description:
        'Klondike Solitaire cổ điển với chế độ lật 1 & 3 lá, gợi ý thông minh và hướng dẫn.',
      controls: 'Nhấp / Kéo / Nhấp đúp',
    },
  },
  sudoku: {
    zh: {
      title: '数独',
      description: '求解唯一解的 9×9 数独谜题，支持铅笔草稿、提示与撤销。',
      controls: '点击 / 数字 1–9 / 方向键',
    },
    vi: {
      title: 'Sudoku',
      description:
        'Giải các bảng Sudoku 9×9 có nghiệm duy nhất với ghi chú nháp, gợi ý và hoàn tác.',
      controls: 'Nhấp / Phím 1–9 / Mũi tên',
    },
  },
  'super-mario-bros': {
    zh: {
      title: '超级马力欧兄弟 1985',
      description: '经典 1985 FC 横版过关游戏，畅玩 1-1 至 1-4 关卡。',
      controls: '方向键/WASD · 空格跳跃 · Shift 加速/火球',
    },
    vi: {
      title: 'Super Mario Bros. 1985',
      description:
        'Tựa game đi cảnh NES 1985 kinh điển qua các màn World 1-1 đến 1-4.',
      controls: 'Mũi tên/WASD · Space Nhảy · Shift Chạy/Bắn lửa',
    },
  },
  'ta-la-phom': {
    zh: {
      title: '越南吃牌扑克 (Tá Lả / Phỏm)',
      description:
        '经典越南 Phỏm 纸牌，支持吃牌/摸牌、亮牌、寄牌、2–4 人 AI 与同屏对战。',
      controls: '点击 / 轻触 · 2–4 人',
    },
    vi: {
      title: 'Tá Lả (Phỏm)',
      description:
        'Game bài Phỏm Việt Nam kinh điển với Ăn/Bốc, Hạ Phỏm, Gửi bài, chơi 2–4 người với AI hoặc chuyền tay.',
      controls: 'Nhấp / Chạm · 2–4 người',
    },
  },
  'tan-do': {
    zh: {
      title: '攻防王牌 (Tấn Đỡ)',
      description:
        '越南主牌攻防纸牌对战，包含进攻、防守、收牌与 2–4 人模式。',
      controls: '点击 / 轻触 · 2–4 人',
    },
    vi: {
      title: 'Tấn Đỡ (Bài Tấn)',
      description:
        'Game bài Tấn công & Phòng thủ truyền thống Việt Nam với Tấn/Đỡ/Ôm bài và chế độ 2–4 người.',
      controls: 'Nhấp / Chạm · 2–4 người',
    },
  },
  tetris: {
    zh: {
      title: '俄罗斯方块',
      description: '标准指南规则俄罗斯方块，支持 7-bag 随机、SRS 踢墙、暂存、幽灵块与教学。',
      controls: '方向键 / 空格 / C',
    },
    vi: {
      title: 'Xếp Hình (Tetris)',
      description:
        'Tetris chuẩn Guideline với 7-bag, xoay SRS, Giữ gạch, Bóng mờ và Chế độ hướng dẫn.',
      controls: 'Mũi tên / Space / C',
    },
  },
  'tien-len-mien-bac': {
    zh: {
      title: '北越十三张 (Tiến Lên Miền Bắc)',
      description: '严谨规则的北越十三张，同色同花型压制、四条炸弹与 2–4 人模式。',
      controls: '点击 / 轻触 · 2–4 人',
    },
    vi: {
      title: 'Tiến Lên Miền Bắc',
      description:
        'Tiến Lên Miền Bắc chuẩn luật đồng chất/đồng màu, Tứ quý và chế độ 2–4 người.',
      controls: 'Nhấp / Chạm · 2–4 người',
    },
  },
  'tien-len-mien-nam': {
    zh: {
      title: '南越十三张 (Tiến Lên Miền Nam)',
      description:
        '南越十三张，支持连对、四条、天胡，以及 2–4 人 AI 与同屏对战。',
      controls: '点击 / 轻触 · 2–4 人',
    },
    vi: {
      title: 'Tiến Lên Miền Nam',
      description:
        'Tiến Lên Miền Nam với Đôi thông, Tứ quý, Tới Trắng và chế độ 2–4 người đấu AI hoặc chuyền tay.',
      controls: 'Nhấp / Chạm · 2–4 người',
    },
  },
};
