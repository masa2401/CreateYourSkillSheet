// 共通の質問データ
export const commonQuestionData = [
    {
        id: 1,
        questionText: 'Q. 実務で使用経験のあるオフィスソフトをすべて選択してください。',
        answers: [
            'Microsoft Word （報告書・議事録作成など）',
            'Microsoft Excel （関数、ピボットテーブル、グラフ作成など）',
            'Microsoft PowerPoint （提案資料・プレゼン資料作成など）',
            'Google Workspace (ドキュメント, スプレッドシート, スライド)',
        ],
    },
    {
        id: 2,
        questionText: 'Q. 業務で日常的に使用したことのあるコミュニケーションツールをすべて選択してください。',
        answers: [
            'Slack',
            'Microsoft Teams',
            'Zoom',
            'Google Meet',
        ],
    },
    {
        id: 3,
        questionText: 'Q. 以下のIT関連知識・スキルについて、当てはまるものをすべて選択してください。',
        answers: [
            'Windowsの基本操作・設定ができる',
            'macOSの基本操作・設定ができる',
            'PCの簡単なパーツ交換（メモリ増設、ストレージ交換など）が可能',
            'ネットワークの基礎知識（IPアドレス、DNSなど）を理解している',
            '基本的なセキュリティ対策（パスワード管理、フィッシング対策など）を実践している',
        ],
    },
]

// エンジニア向けの質問データ
export const engineerQuestionData = [
    {
        id: 1,
        questionText: 'Q. 実務で使用経験のあるフロントエンド言語・マークアップ言語をすべて選択してください。',
        answers: ['HTML', 'CSS', 'Sass/SCSS', 'JavaScript', 'TypeScript'],
    },
    {
        id: 2,
        questionText: 'Q. 実務で使用経験のあるバックエンド言語をすべて選択してください。',
        answers: ['PHP', 'Ruby', 'Python', 'Java', 'Go'],
    },
    {
        id: 3,
        questionText: 'Q. 実務で使用経験のあるフレームワーク/ライブラリをすべて選択してください。',
        answers: [
            'React',
            'Vue.js',
            'Angular',
            'jQuery',
            'Laravel(PHP)',
            'Ruby on Rails(Ruby)',
            'Django(Python)',
            'Spring(Java)',
        ],
    },
    {
        id: 4,
        questionText: 'Q. 実務で使用経験のあるデータベースをすべて選択してください。',
        answers: ['MySQL / MariaDB', 'PostgreSQL', 'Oracle Database', 'MongoDB', 'Redis'],
    },
    {
        id: 5,
        questionText: 'Q. 実務で使用経験のあるバージョン管理ツールをすべて選択してください。',
        answers: ['Git / GitHub / GitLab', 'Subversion (SVN)', 'Mercurial', 'Perforce'],
    },
    {
        id: 6,
        questionText: 'Q. サーバーとして構築・運用経験のあるOSをすべて選択してください。',
        answers: ['Linux (RHEL/CentOS系)', 'Linux (Ubuntu/Debian系)', 'Windows Server'],
    },
    {
        id: 7,
        questionText: 'Q. 主な業務で利用したことのあるクラウドプラットフォームをすべて選択してください。',
        answers: ['AWS (Amazon Web Services)', 'Microsoft Azure', 'GCP (Google Cloud Platform)'],
    },
    {
        id: 8,
        questionText: 'Q. 実務で使用経験のある仮想化・コンテナ技術をすべて選択してください。',
        answers: ['VMware vSphere', 'Docker', 'Kubernetes'],
    },
    {
        id: 9,
        questionText: 'Q. 実務で使用経験のある構成管理・自動化ツールをすべて選択してください。',
        answers: ['Ansible', 'Terraform', 'シェルスクリプト (Bashなど)'],
    },
    {
        id: 10,
        questionText: 'Q. 実務で設定・運用経験のあるネットワーク機器や監視ツールをすべて選択してください。',
        answers: [
            'L2/L3スイッチ (Ciscoなど)',
            'ルーター',
            'ファイアウォール',
            'ロードバランサー',
            'Zabbix',
            'Prometheus / Grafana',
            'Datadog',
        ],
    },
]

// デザイナー向けの質問データ
export const designerQuestionData = [
    {
        id: 1,
        questionText: 'Q. WebサイトやアプリのUI/UXデザインで使用経験のあるツールをすべて選択してください。',
        answers: [
            'Figma',
            'Sketch',
            'Adobe XD',
            'Procreate (ワイヤーフレーム/ラフ作成など)',
        ],
    },
    {
        id: 2,
        questionText: 'Q. イラスト制作を主目的として使用したことのあるツールをすべて選択してください。',
        answers: ['Illustrator', 'Photoshop', 'Clip Studio Paint', 'Procreate'],
    },
    {
        id: 3,
        questionText: 'Q. Webデザインの実装（コーディング）において、対応可能なものをすべて選択してください。',
        answers: [
            'HTML/CSSによるコーディング',
            'レスポンシブデザイン対応',
            'JavaScript (jQuery含む)での簡単なインタラクション実装',
            'WordPressのテーマ作成・カスタマイズ',
        ],
    },
    {
        id: 4,
        questionText: 'Q. DTP（印刷物）デザインにおいて、経験のある業務をすべて選択してください。',
        answers: [
            '名刺・チラシ・ポスターなどの制作',
            'パンフレット・冊子などのページレイアウト',
            '印刷会社への入稿データ作成',
            '色校正（色味の確認・修正指示）の経験',
        ],
    },
    {
        id: 5,
        questionText: 'Q. 実務で使用経験のある動画編集ソフトをすべて選択してください。',
        answers: [
            'Adobe Premiere Pro （カット編集、テロップ入れ、整音など標準的な編集）',
            'Adobe After Effects （モーショングラフィックス、VFX、高度なアニメーション作成）',
            'Final Cut Pro （Mac環境での編集、カット、トランジション適用など）',
            'DaVinci Resolve （カラーグレーディング、色調補正、編集など）',
            'CapCut / VLLO など （スマホ・タブレット向けアプリでのショート動画作成）',
        ],
    },
    {
        id: 6,
        questionText: 'Q. 以下の編集スキル・操作について、自信を持って対応できるものをすべて選択してください。',
        answers: [
            'カット編集（ジェットカット、マルチカメラ編集など）',
            'テロップ・字幕の挿入（見やすいフォント選定、装飾、タイミング調整）',
            'BGM・効果音（SE）の選定・挿入および音量バランスの調整',
            'モーショングラフィックスの作成（動くロゴ、タイトルアニメーションなど）',
            'キーイング・合成処理（グリーンバック合成、マスク処理など）',
            'カラーコレクション・カラーグレーディング（Log撮影データの編集、LUT適用など）',
            '音声のノイズ除去・整音（環境音の低減、聞き取りやすい音声への加工）',
        ],
    },
    {
        id: 7,
        questionText: 'Q. 動画制作に関連する知識・周辺スキルについて、当てはまるものをすべて選択してください。',
        answers: [
            'サムネイル画像の作成（PhotoshopやCanva等を使用し、クリック率を意識した画像が作れる）',
            'エンコード・書き出し設定の知識（解像度、フレームレート、コーデック、ビットレートの理解）',
            '動画の構成・台本作成（構成案の作成や、絵コンテの作成が可能）',
            '撮影機材の基本操作（一眼レフ、照明、マイク等のセッティングと撮影）',
            '著作権・肖像権に関する基礎知識（BGMや素材サイトの利用規約理解、権利侵害の防止）',
        ],
    },
    {
        id: 8,
        questionText: 'Q. これまでに制作・編集経験のある動画ジャンルを選択してください。',
        answers: [
            'YouTube動画（エンタメ、ビジネス系、Vlogなど）',
            'ショート動画（TikTok、Instagram Reels、YouTube Shorts）',
            '企業プロモーション・商品紹介動画',
            'インタビュー・対談動画',
            'イベント・ウェディングムービー',
            'ゲーム実況動画',
        ],
    },
]