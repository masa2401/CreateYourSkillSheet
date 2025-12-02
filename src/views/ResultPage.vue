<script setup lang="js">
import { ref } from 'vue'

const surveyData = ref()
const stored = localStorage.getItem('surveyData')
if (stored) {
  surveyData.value = JSON.parse(stored)
}
const data = surveyData.value
console.log(data.commonQuestions)
</script>
<template>
  <div class="wrap">
    <p>{{ data.userName }} 様のスキルシート</p>
    <div v-for="category in data.categories" :key="category.id" v-show="category.isChecked">
      <table>
        <thead>
          <tr>
            <th>項目</th>
            <th>習熟度</th>
          </tr>
        </thead>
        <tbody v-for="question in data.commonQuestions" :key="question.id">
          <tr>
            <th>{{ question.answers.text }}</th>
            <th>{{ question.answers.value }}</th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped></style>
