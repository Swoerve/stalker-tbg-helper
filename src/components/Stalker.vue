<template>
  <v-container v-show="isActive" class="ma-0 pa-0 w-100" fluid>
    <v-row no-gutters>
      <v-col cols="8">
        <v-select :items="campaign.stalkers" item-title="name" item-value="id" return-object v-model="selectedStalker"
          label="stalker" center-affix hide-details>
        </v-select>
      </v-col>
      <v-col cols="4" align-self="center">
        <v-btn block color="success" @click="overlay = true">
          New Stalker
          <v-overlay v-model="overlay" class="align-center justify-center">
            <v-card>
              <v-card-title primary-title>
                New Stalker
              </v-card-title>
              <v-form validate-on="submit" @submit.prevent="submit">
                <v-text-field contained="true" name="name" label="Name" placeholder="name" style="min-width: 10rem;"
                  v-model="stalkerName" :rules="stalkerRule"></v-text-field>
                <v-text-field contained="true" name="player" label="Player" placeholder="player"
                  style="min-width: 10rem;" v-model="playerName" :rules="nameRule"></v-text-field>
                <v-card-actions>
                  <v-btn :loading="loading" color="success" type="submit">Create</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-overlay>
        </v-btn>
      </v-col>
    </v-row>
    <v-card v-if="selectedStalker" class="ma-2">
      <v-card-title class="pb-0 text-h5 text-yellow-accent-3 font-weight-bold">{{ selectedStalker.name }}</v-card-title>
      <v-card-subtitle class="text-subtitle1">{{ (selectedStalker.player) }}</v-card-subtitle>
      <!-- <v-card-subtitle class="text-subtitle1">{{ (selectedStalker.id) }}</v-card-subtitle> -->
      <v-divider></v-divider>
      <v-card-title>
        Equipment
      </v-card-title>
      <Equipment :stalker="selectedStalker"></Equipment>
      <v-divider></v-divider>
      <v-card-title>
        Achivements
      </v-card-title>
      <Achievements :stalker="selectedStalker"></Achievements>
      <v-card-actions>
        <v-btn color="error" @click="deleteStalker(selectedStalker.id)">Kill</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">

import { defineComponent, ref, toRefs, watch, toRef, VueElement } from 'vue';
import * as game from '../campaign'
import type { Ref } from 'vue'
import Equipment from "./Equipment.vue"
import Achievements from "./Achievements.vue"
import type { SubmitEventPromise } from 'vuetify'


// const props = defineProps({
//   campaign: {
//     type: game.Campaign,
//     required: true
//   },
//   isActive: Boolean
// })
// const { campaign, isActive } = toRefs(props)

const campaign = defineModel('campaign', { type: game.Campaign, required: true })
const isActive = defineModel('isActive', { type: Boolean, required: true })

//const campaign = toRef(props.campaign)
//const isActive = toRef(props.isActive)
let selectedStalker: any = ref(campaign.value.stalkers[0])
console.log(selectedStalker.value)

let loading = ref(false)
async function submit(event: SubmitEventPromise) {
  loading.value = true

  const results = await event



  console.log(JSON.stringify(results, null, 2))
  if (results.valid) {
    createStalker()
    overlay.value = false
  }
  loading.value = false
}

// new stalker variables
let stalkerName = ref('')
let playerName = ref('')
let overlay = ref(false)

let stalkerRule = [(value: string) => {
  return value ? true : 'You must enter a name'
}]

let nameRule = [(value: string) => {
  return value ? true : 'You must enter a name'
}]


function createStalker() {
  console.log('creating stalker...')
  if (playerName.value && stalkerName.value) {
    campaign.value.newStalker(stalkerName.value, playerName.value, game.generateId(campaign.value.stalkers))
  }
  else {
    alert("You need to input both player and stalker names")
  }
}

function deleteStalker(id: string) {
  console.log('deleting stalker...')
  let toDeleteStalker = campaign.value.stalkers.findIndex((value, index, array) => {
    return value.id === id
  })
  console.log(toDeleteStalker)
  campaign.value.stalkers.splice(toDeleteStalker, 1)
  if (campaign.value.stalkers.length > 0 && toDeleteStalker === 0) {
    selectedStalker.value = campaign.value.stalkers[0]
    console.log(selectedStalker)
  } else if (campaign.value.stalkers.length > 0) {
    selectedStalker.value = campaign.value.stalkers[toDeleteStalker - 1]
  } else {
    selectedStalker.value = campaign.value.stalkers[0]
  }
}

</script>
