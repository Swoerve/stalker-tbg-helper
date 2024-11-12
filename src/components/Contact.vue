<template>
  <v-container v-show="isActive" class="ma-0 pa-0 w-100" fluid>
    <v-row no-gutters>
      <v-col v-for="(item, index) in campaign.contacts" :key="index" cols="6">
        <v-card class="ma-2">
          <v-card-title class="pb-0 text-h5 text-yellow-accent-3 font-weight-bold">{{ item.name
            }}</v-card-title>
          <v-card-subtitle class="text-subtitle1">{{ (item.card) }}</v-card-subtitle>
          <v-card-text>
            {{ item.type }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" @click="deleteContact(item.id)" icon="mdi-minus" size="small"></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="ma-2">
          <v-card-actions>
            <v-btn color="success" @click="overlay = true" prepend-icon="mdi-plus">
              New Contact
              <v-overlay v-model="overlay" class="align-center justify-center">
                <v-card class="pa-3" width="250">
                  <v-card-title primary-title>
                    New Contact
                  </v-card-title>
                  <v-form @submit.prevent="submit">
                    <v-text-field contained="true" name="name" label="Name" placeholder="name" style="min-width: 10rem;"
                      v-model="contactName" :rules="contactNameRule"></v-text-field>
                    <v-text-field contained="true" name="card" label="Card" placeholder="C00" style="min-width: 10rem;"
                      v-model="contactCard" :rules="contactCardRule"></v-text-field>
                    <v-radio-group v-model="contactType" label="Type">
                      <v-radio color="yellow" label="Loner" value="loner"></v-radio>
                      <v-radio color="yellow" label="Trader" value="trader"></v-radio>
                      <v-radio color="yellow" label="Companion" value="companion"></v-radio>
                      <v-radio color="yellow" label="Contract" value="contract"></v-radio>
                    </v-radio-group>
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

import { defineComponent, ref, toRefs, watch, toRef, VueElement } from 'vue';
import * as game from '../campaign'
import type { Ref } from 'vue'
import type { SubmitEventPromise } from 'vuetify'

const campaign = defineModel('campaign', { type: game.Campaign, required: true })
const isActive = defineModel('isActive', { type: Boolean, required: true })

// new contact variables
let contactName = ref('')
let contactCard = ref('')
let contactType = ref('loner')
let overlay = ref(false)

let contactNameRule = [(value: string) => {
  return value ? true : 'You must enter a name'
}]

let contactCardRule = [(value: string) => {
  if (value.length === 3) {
    return /^[C]\d{2}/.test(value) ? true : 'Card should look like CXX'
  }
  else {
    return 'Card should look like CXX'
  }
}]


let loading = ref(false)
async function submit(event: SubmitEventPromise) {
  loading.value = true

  const results = await event

  console.log(JSON.stringify(results, null, 2))
  if (results.valid) {
    createContact()
    overlay.value = false
  }
  loading.value = false
}
function createContact() {
  console.log('creating contact...')
  if (contactName.value && contactCard.value && contactType.value) {
    campaign.value.newContact(contactName.value, game.generateId(campaign.value.contacts), contactCard.value, contactType.value)
  }
  else {
    alert("You need to input both name, card and type")
  }
}

function deleteContact(id: string) {
  console.log('deleting contact...')
  let toDeleteContact = campaign.value.contacts.findIndex((value, index, array) => {
    return value.id === id
  })
  console.log(toDeleteContact)
  campaign.value.contacts.splice(toDeleteContact, 1)
}
</script>
