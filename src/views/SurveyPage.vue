<script setup lang="js">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TopButton from '@/components/TopButton.vue'

const userName = localStorage.name.toString()
const router = useRouter()

const toNext = () => {
  const surveyData = {
    userName: userName,
    categories: categories.value,
    commonQuestions: commonQuestions.value.map((q) => ({
      id: q.id,
      question: q.question,
      answers: q.answers.map((a) => ({
        text: a.text,
        isChecked: a.isChecked,
        value: a.value,
      })),
    })),
    enginnerQuestions: enginnerQuestions.value.map((q) => ({
      id: q.id,
      question: q.question,
      answers: q.answers.map((a) => ({
        text: a.text,
        isChecked: a.isChecked,
        value: a.value,
      })),
    })),
    designerQuestions: designerQuestions.value.map((q) => ({
      id: q.id,
      question: q.question,
      answers: q.answers.map((a) => ({
        text: a.text,
        isChecked: a.isChecked,
        value: a.value,
      })),
    })),
  }

  localStorage.setItem('surveyData', JSON.stringify(surveyData))

  router.push({
    path: '/result',
  })
}
// localStorageから取り出す時に真偽値に変換する
const toBoolean = (t) => {
  return t == 'true' ? true : false
}
const program = toBoolean(localStorage.program)
const design = toBoolean(localStorage.design)

// 前ページのチェックした項目のみ表示させる
const categories = ref([
  { id: 1, genre: '共通の質問', isChecked: true },
  { id: 2, genre: 'プログラマ/エンジニア向けの質問', isChecked: program },
  { id: 3, genre: 'デザイナ（動画制作）向けの質問', isChecked: design },
])

// 共通の質問
const commonQuestions = ref([
  {
    id: 1,
    question: 'Q. 実務で使用経験のあるオフィスソフトをすべて選択してください。',
    answers: [
      { text: 'Microsoft Word （報告書・議事録作成など）', value: ref() },
      {
        text: 'Microsoft Excel （関数、ピボットテーブル、グラフ作成など）',
        value: ref(),
      },
      {
        text: 'Microsoft PowerPoint （提案資料・プレゼン資料作成など）',
        value: ref(),
      },
      {
        text: 'Google Workspace (ドキュメント, スプレッドシート, スライド)',
        value: ref(),
      },
    ],
  },
  {
    id: 2,
    question:
      'Q. 業務で日常的に使用したことのあるコミュニケーションツールをすべて選択してください。',
    answers: [
      { text: 'Slack', value: ref() },
      { text: 'Microsoft Teams', value: ref() },
      { text: 'Zoom', value: ref() },
      { text: 'Google Meet', value: ref() },
    ],
  },
  {
    id: 3,
    question: 'Q. 以下のIT関連知識・スキルについて、当てはまるものをすべて選択してください。',
    answers: [
      { text: 'Windowsの基本操作・設定ができる', value: ref() },
      { text: 'macOSの基本操作・設定ができる', value: ref() },
      { text: 'PCの簡単なパーツ交換（メモリ増設、ストレージ交換など）が可能', value: ref() },
      { text: 'ネットワークの基礎知識（IPアドレス、DNSなど）を理解している', value: ref() },
      {
        text: '基本的なセキュリティ対策（パスワード管理、フィッシング対策など）を実践している',
        value: ref(),
      },
    ],
  },
])
// プログラマ、エンジニア向けの質問
const enginnerQuestions = ref([
  {
    id: 1,
    question:
      'Q. 実務で使用経験のあるフロントエンド言語・マークアップ言語をすべて選択してください。',
    answers: [
      { text: 'HTML', value: ref() },
      { text: 'CSS', value: ref() },
      { text: 'Sass/SCSS', value: ref() },
      { text: 'JavaScript', value: ref() },
      { text: 'TypeScript', value: ref() },
    ],
  },
  {
    id: 2,
    question: 'Q. 実務で使用経験のあるバックエンド言語をすべて選択してください。',
    answers: [
      { text: 'PHP', value: ref() },
      { text: 'Ruby', value: ref() },
      { text: 'Python', value: ref() },
      { text: 'Java', value: ref() },
      { text: 'Go', value: ref() },
    ],
  },
  {
    id: 3,
    question: 'Q. 実務で使用経験のあるフレームワーク/ライブラリをすべて選択してください。',
    answers: [
      { text: 'React', value: ref() },
      { text: 'Vue.js', value: ref() },
      { text: 'Angular', value: ref() },
      { text: 'jQuery', value: ref() },
      { text: 'Laravel(PHP)', value: ref() },
      { text: 'Ruby on Rails(Ruby)', value: ref() },
      { text: 'Django(Python)', value: ref() },
      { text: 'Spring(Java)', value: ref() },
    ],
  },
  {
    id: 4,
    question: 'Q. 実務で使用経験のあるデータベースをすべて選択してください。',
    answers: [
      { text: 'MySQL / MariaDB', value: ref() },
      { text: 'PostgreSQL', value: ref() },
      { text: 'Oracle Database', value: ref() },
      { text: 'MongoDB', value: ref() },
      { text: 'Redis', value: ref() },
    ],
  },
  {
    id: 5,
    question: 'Q. 実務で使用経験のあるバージョン管理ツールをすべて選択してください。',
    answers: [
      { text: 'Git / GitHub / GitLab', value: ref() },
      { text: 'Subversion (SVN)', value: ref() },
      { text: 'Mercurial', value: ref() },
      { text: 'Perforce', value: ref() },
    ],
  },
  {
    id: 6,
    question: 'Q. サーバーとして構築・運用経験のあるOSをすべて選択してください。',
    answers: [
      { text: 'Linux (RHEL/CentOS系)', value: ref() },
      { text: 'Linux (Ubuntu/Debian系)', value: ref() },
      { text: 'Windows Server', value: ref() },
    ],
  },
  {
    id: 7,
    question: 'Q. 主な業務で利用したことのあるクラウドプラットフォームをすべて選択してください。',
    answers: [
      { text: 'AWS (Amazon Web Services)', value: ref() },
      { text: 'Microsoft Azure', value: ref() },
      { text: 'GCP (Google Cloud Platform)', value: ref() },
    ],
  },
  {
    id: 8,
    question: 'Q. 実務で使用経験のある仮想化・コンテナ技術をすべて選択してください。',
    answers: [
      { text: 'VMware vSphere', value: ref() },
      { text: 'Docker', value: ref() },
      { text: 'Kubernetes', value: ref() },
    ],
  },
  {
    id: 9,
    question: 'Q. 実務で使用経験のある構成管理・自動化ツールをすべて選択してください。',
    answers: [
      { text: 'Ansible', value: ref() },
      { text: 'Terraform', value: ref() },
      { text: 'シェルスクリプト (Bashなど)', value: ref() },
    ],
  },
  {
    id: 10,
    question: 'Q. 実務で設定・運用経験のあるネットワーク機器や監視ツールをすべて選択してください。',
    answers: [
      { text: 'L2/L3スイッチ (Ciscoなど)', value: ref() },
      { text: 'ルーター', value: ref() },
      { text: 'ファイアウォール', value: ref() },
      { text: 'ロードバランサー', value: ref() },
      { text: 'Zabbix', value: ref() },
      { text: 'Prometheus / Grafana', value: ref() },
      { text: 'Datadog', value: ref() },
    ],
  },
])
// デザイン、動画制作の方向けの質問
const designerQuestions = ref([
  {
    id: 1,
    question: 'Q. WebサイトやアプリのUI/UXデザインで使用経験のあるツールをすべて選択してください。',
    answers: [
      { text: 'Figma', value: ref() },
      { text: 'Sketch', value: ref() },
      { text: 'Adobe XD', value: ref() },
      { text: 'Procreate (ワイヤーフレーム/ラフ作成など)', value: ref() },
    ],
  },
  {
    id: 2,
    question: 'Q. イラスト制作を主目的として使用したことのあるツールをすべて選択してください。',
    answers: [
      { text: 'Illustrator', value: ref() },
      { text: 'Photoshop', value: ref() },
      { text: 'Clip Studio Paint', value: ref() },
      { text: 'Procreate', value: ref() },
    ],
  },
  {
    id: 3,
    question:
      'Q. Webデザインの実装（コーディング）において、対応可能なものをすべて選択してください。',
    answers: [
      { text: 'HTML/CSSによるコーディング', value: ref() },
      { text: 'レスポンシブデザイン対応', value: ref() },
      { text: 'JavaScript (jQuery含む)での簡単なインタラクション実装', value: ref() },
      { text: 'WordPressのテーマ作成・カスタマイズ', value: ref() },
    ],
  },
  {
    id: 4,
    question: 'Q. DTP（印刷物）デザインにおいて、経験のある業務をすべて選択してください。',
    answers: [
      { text: '名刺・チラシ・ポスターなどの制作', value: ref() },
      { text: 'パンフレット・冊子などのページレイアウト', value: ref() },
      { text: '印刷会社への入稿データ作成', value: ref() },
      { text: '色校正（色味の確認・修正指示）の経験', value: ref() },
    ],
  },
  {
    id: 5,
    question: 'Q. 実務で使用経験のある動画編集ソフトをすべて選択してください。',
    answers: [
      {
        text: 'Adobe Premiere Pro （カット編集、テロップ入れ、整音など標準的な編集）',
        value: ref(),
      },
      {
        text: 'Adobe After Effects （モーショングラフィックス、VFX、高度なアニメーション作成）',
        value: ref(),
      },
      { text: 'Final Cut Pro （Mac環境での編集、カット、トランジション適用など）', value: ref() },
      { text: 'DaVinci Resolve （カラーグレーディング、色調補正、編集など）', value: ref() },
      {
        text: 'CapCut / VLLO など （スマホ・タブレット向けアプリでのショート動画作成）',
        value: ref(),
      },
    ],
  },
  {
    id: 6,
    question:
      'Q. 以下の編集スキル・操作について、自信を持って対応できるものをすべて選択してください。',
    answers: [
      { text: 'カット編集（ジェットカット、マルチカメラ編集など）', value: ref() },
      { text: 'テロップ・字幕の挿入（見やすいフォント選定、装飾、タイミング調整）', value: ref() },
      { text: 'BGM・効果音（SE）の選定・挿入および音量バランスの調整', value: ref() },
      {
        text: 'モーショングラフィックスの作成（動くロゴ、タイトルアニメーションなど）',
        value: ref(),
      },
      { text: 'キーイング・合成処理（グリーンバック合成、マスク処理など）', value: ref() },
      {
        text: 'カラーコレクション・カラーグレーディング（Log撮影データの編集、LUT適用など）',
        value: ref(),
      },
      { text: '音声のノイズ除去・整音（環境音の低減、聞き取りやすい音声への加工）', value: ref() },
    ],
  },
  {
    id: 7,
    question:
      'Q. 動画制作に関連する知識・周辺スキルについて、当てはまるものをすべて選択してください。',
    answers: [
      {
        text: 'サムネイル画像の作成（PhotoshopやCanva等を使用し、クリック率を意識した画像が作れる）',
        value: ref(),
      },
      {
        text: 'エンコード・書き出し設定の知識（解像度、フレームレート、コーデック、ビットレートの理解）',
        value: ref(),
      },
      { text: '動画の構成・台本作成（構成案の作成や、絵コンテの作成が可能）', value: ref() },
      { text: '撮影機材の基本操作（一眼レフ、照明、マイク等のセッティングと撮影）', value: ref() },
      {
        text: '著作権・肖像権に関する基礎知識（BGMや素材サイトの利用規約理解、権利侵害の防止）',
        value: ref(),
      },
    ],
  },
  {
    id: 8,
    question: 'Q. これまでに制作・編集経験のある動画ジャンルを選択してください。',
    answers: [
      { text: 'YouTube動画（エンタメ、ビジネス系、Vlogなど）', value: ref() },
      { text: 'ショート動画（TikTok、Instagram Reels、YouTube Shorts）', value: ref() },
      { text: '企業プロモーション・商品紹介動画', value: ref() },
      { text: 'インタビュー・対談動画', value: ref() },
      { text: 'イベント・ウェディングムービー', value: ref() },
      { text: 'ゲーム実況動画', value: ref() },
    ],
  },
])
</script>
<template>
  <div class="wrap">
    <p>{{ userName }} 様</p>
    <p>以下の質問にチェックを入れていただき、習熟度を5段階で御回答ください。</p>
    <div v-for="category in categories" :key="category.id" v-show="category.isChecked === true">
      <h2 class="title">{{ category.genre }}</h2>
      <template v-for="commonQuestion in commonQuestions" :key="commonQuestion.id">
        <div v-if="category.id === 1">
          <p>{{ commonQuestion.question }}</p>
          <ul>
            <li v-for="answer in commonQuestion.answers" :key="answer.index">
              <!-- v-modelでフラグを監視して、チェックを入れるとラジオボックスを出現させる -->
              <label><input type="checkbox" v-model="answer.isChecked" />{{ answer.text }}</label>
              <div class="radiobox" v-if="answer.isChecked">
                <input type="radio" v-model="answer.value" :value="1" />1
                <input type="radio" v-model="answer.value" :value="2" />2
                <input type="radio" v-model="answer.value" :value="3" />3
                <input type="radio" v-model="answer.value" :value="4" />4
                <input type="radio" v-model="answer.value" :value="5" />5
              </div>
            </li>
          </ul>
        </div>
      </template>
      <template v-for="enginnerQuestion in enginnerQuestions" :key="enginnerQuestion.id">
        <div v-if="category.id === 2">
          <p>{{ enginnerQuestion.question }}</p>
          <ul>
            <li v-for="answer in enginnerQuestion.answers" :key="answer.index">
              <label><input type="checkbox" v-model="answer.isChecked" />{{ answer.text }}</label>
              <div class="radiobox" v-if="answer.isChecked">
                <input type="radio" v-model="answer.value" :value="1" />1
                <input type="radio" v-model="answer.value" :value="2" />2
                <input type="radio" v-model="answer.value" :value="3" />3
                <input type="radio" v-model="answer.value" :value="4" />4
                <input type="radio" v-model="answer.value" :value="5" />5
              </div>
            </li>
          </ul>
        </div>
      </template>
      <template v-for="designerQuestion in designerQuestions" :key="designerQuestion.id">
        <div v-if="category.id === 3">
          <p>{{ designerQuestion.question }}</p>
          <ul>
            <li v-for="answer in designerQuestion.answers" :key="answer.index">
              <label><input type="checkbox" v-model="answer.isChecked" />{{ answer.text }}</label>
              <div class="radiobox" v-if="answer.isChecked">
                <input type="radio" v-model="answer.value" :value="1" />1
                <input type="radio" v-model="answer.value" :value="2" />2
                <input type="radio" v-model="answer.value" :value="3" />3
                <input type="radio" v-model="answer.value" :value="4" />4
                <input type="radio" v-model="answer.value" :value="5" />5
              </div>
            </li>
          </ul>
        </div>
      </template>
    </div>
    <TopButton @click="toNext">次へ進む</TopButton>
  </div>
</template>
<style scoped>
ul {
  display: flex;
  flex-direction: column;
}
li {
  justify-content: flex-start;
  text-align: start;
  margin-bottom: 0.5em;
}
p {
  text-align: start;
}
label {
  padding: 0.25rem 0;
  cursor: pointer;
}
input[type='radio'] {
  cursor: pointer;
}
.wrap > p {
  text-align: center;
}
.radiobox {
  padding-left: 2rem;
}
</style>
