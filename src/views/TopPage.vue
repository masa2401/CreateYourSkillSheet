<script setup lang="js">
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import TopButton from '@/components/TopButton.vue'

const router = useRouter()
const userName = ref()
const checks = reactive({
  program: 'false',
  design: 'false',
})

// 次へボタンで名前の保存とチェックされたデータを遷移先ページに渡す

const toNext = () => {
  localStorage.name = userName.value ? userName.value : 'guest'
  localStorage.program = checks.program
  localStorage.design = checks.design
  router.push({
    path: '/survey',
  })
}
</script>

<template>
  <div class="wrap">
    <div class="intro">
      <input
        type="text"
        class="username-input"
        v-model="userName"
        placeholder="お名前をご入力ください"
      />
      <p>
        {{ userName }} 様 これからいくつかの質問を行います。<br />
        質問に回答後にスキルシートが出力されます。
      </p>
    </div>
    <fieldset>
      <legend>当てはまる項目にチェックを入れて（複数可）次へボタンを押してください。</legend>
      <div>
        <input
          type="checkbox"
          id="programmer"
          name="programmer"
          v-model="checks.program"
          @change="updateQuery"
        />
        <label for="programmer">プログラマ（ITエンジニア）の方</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="designer"
          name="designer"
          v-model="checks.design"
          @change="updateQuery"
        />
        <label for="designer">デザイン（動画制作）職の方</label>
      </div>
    </fieldset>
    <TopButton @click="toNext">次へ進む</TopButton>
  </div>
</template>

<style scoped>
.username-input {
  font-size: 1.5rem;
  text-align: center;
  line-height: 2;
}
fieldset {
  display: flex;
  justify-content: center;
  gap: 2rem;
  border: none;
}
</style>
