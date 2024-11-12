<template>
  <v-container>
    <title>Achievements</title>
    <v-row>
      <v-col v-for="(item, index) in stalker.achievements" :key="index" cols="6">
        <v-card class="ma-2 pa-2">
          <v-card-title class="pb-0 text-h5 text-yellow-accent-3 font-weight-bold">{{ item.title }}</v-card-title>
          <v-card-subtitle class="text-subtitle1">{{ (item.condition) }}</v-card-subtitle>
          <!-- <v-card-subtitle class="text-subtitle1">{{ (item.id) }}</v-card-subtitle> -->
          <v-switch label="Completed" v-model="item.completed" color="yellow" inset></v-switch>
          <v-card-subtitle v-if="item.completed" class="text-subtitle1">{{ (item.reward) }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="error" @click="removeItem(item.id)" icon="mdi-minus" size="small"></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="ma-2">
          <v-card-actions>
            <v-btn color="success" @click="overlay = true" prepend-icon="mdi-plus">
              New Achievement
              <v-overlay v-model="overlay" class="align-center justify-center">
                <v-card class="pa-3" width="250">
                  <v-card-title primary-title>
                    New Achievement
                  </v-card-title>
                  <v-form @submit.prevent="submit">
                    <v-text-field contained="true" name="title" label="Title" placeholder="title"
                      style="min-width: 10rem;" v-model.trim="achievementTitle"
                      :rules="achievementTitleRule"></v-text-field>
                    <v-textarea label="Description" v-model.trim="achievementDescription" :rules="achievementDescRule">
                    </v-textarea>
                    <v-switch label="Completed" v-model="achievementCompleted" color="yellow"></v-switch>
                    <v-text-field contained="true" name="reward" label="Reward" placeholder="reward"
                      style="min-width: 10rem;" v-model.trim="achievementReward"
                      :rules="achievementRewardRule"></v-text-field>
                    <v-card-actions>
                      <v-btn color="success" type="submit">Create</v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-overlay>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">

import { defineComponent, ref, toRefs, toRef, VueElement } from 'vue';
import * as game from '../campaign'
import type { Ref } from 'vue'
import type { SubmitEventPromise } from 'vuetify'

const stalker = defineModel('stalker', { type: game.Stalker, required: true })

let overlay = ref(false)
let achievementTitle = ref('')
let achievementDescription = ref('')
let achievementCompleted = ref(false)
let achievementReward = ref('')

let achievementTitleRule = [(value: string) => {
  return value ? true : 'You must enter a title'
}]
let achievementDescRule = [(value: string) => {
  return value ? true : 'You must enter a description'
}]
let achievementRewardRule = [(value: string) => {
  return value ? true : 'You must enter a reward'
}]

let loading = ref(false)
async function submit(event: SubmitEventPromise) {
  loading.value = true

  const results = await event



  // console.log(JSON.stringify(results, null, 2))
  if (results.valid) {
    createItem()
    overlay.value = false
  }
  loading.value = false
}

function createItem() {
  // console.log('creating Equipment...')
  stalker.value.addAchievement(
    achievementTitle.value,
    achievementDescription.value,
    game.generateId(stalker.value.achievements),
    achievementReward.value,
    achievementCompleted.value)
  // console.log(stalker.value.achievements[0])

}

function removeItem(id: string) {
  // console.log('deleting stalker...')
  let toDeleteStalker = stalker.value.achievements.findIndex((value, index, array) => {
    return value.id === id
  })
  // console.log(toDeleteStalker)
  stalker.value.achievements.splice(toDeleteStalker, 1)
}

</script>
