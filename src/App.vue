<script setup lang="ts">
import { ref, onMounted, computed, watch, reactive } from "vue"
import type { Ref } from 'vue'
import * as game from './campaign'
import Stalker from "./components/Stalker.vue"
import Contact from "./components/Contact.vue"

// new campaign reference to be populated later on or inserted a new campaign
let campaigns: Ref<game.Campaign[]> = ref([])

// the selected campaign
let selectedCampaign = ref()

//new campaign stuff
let newCampaignOverlay = ref(false) // the overlay for making a new campaign
let newCampaignName = ref('') // the name for the new campaign

// delete campaign stuff
let deleteCampaignOverlay = ref(false) // the overlay for deleting a campaign
let CampaignName = ref('') // the name that the campaign to be deleted has

watch(campaigns, (newVal) => {
  let save: { [k: string]: any } = {}
  newVal.forEach(cmpgn => {
    save[cmpgn.name] = (cmpgn.serialize())
  })
  localStorage.setItem('campaigns', JSON.stringify(save))
}, { deep: true })

onMounted(() => {
  console.log('mounted')
  if (localStorage.getItem('campaigns')) {
    console.log('localstorage exists')
    let load = JSON.parse(localStorage.getItem('campaigns') as string)
    campaigns.value = []
    for (let key in load) {
      console.log(key, load[key])
      campaigns.value.push(game.Campaign.fromSerialized(load[key]))
    }
    console.log('mounting id ' + campaigns.value[0].id)
    selectedCampaign.value = campaigns.value[0]
  }
})

function newCampaign() {
  console.log(campaigns)
  console.log(campaigns.value.length)
  let newId = game.generateId(campaigns.value)
  let newCampaignObject = new game.Campaign(newCampaignName.value, newId)
  console.log(newCampaignObject)
  campaigns.value.push(newCampaignObject)
}

function deleteCampaign() {
  let toDeleteCampaign = campaigns.value.findIndex((value, index, array) => {
    return value.name === CampaignName.value
  })
  if (toDeleteCampaign >= 0) {
    campaigns.value.splice(toDeleteCampaign, 1)
    if (campaigns.value.length > 0 && toDeleteCampaign === 0) {
      selectedCampaign.value = campaigns.value[0]
    } else if (campaigns.value.length > 0) {
      selectedCampaign.value = campaigns.value[toDeleteCampaign - 1]
    } else {
      selectedCampaign.value = campaigns.value[0]
    }
  }

}

const tabs = reactive([true, false, false])
function switchTab(n: number) {
  console.log('switching tabs')
  for (let i = 0; i < tabs.length; i++) {
    tabs[i] = false
    if (i === n) {
      tabs[i] = true
    }
  }
  console.log(tabs)
}

console.log('selected:' + selectedCampaign.value)
</script>

<template>
  <v-app v-if="campaigns.length > 0 && selectedCampaign">
    <v-navigation-drawer app :location="$vuetify.display.mobile ? 'bottom' : undefined" permanent :width="200">
      <v-list-item>
        <v-select :items="campaigns" item-title="name" item-value="id" v-model="selectedCampaign" return-object
          density="compact" label="Campaign"></v-select>
        <v-list-item-title>{{ selectedCampaign.name }}</v-list-item-title>
        <v-list-item-subtitle><v-text-field name="name" label="coupons" id="id" variant="solo"
            v-model.number="selectedCampaign.coupons"></v-text-field>
        </v-list-item-subtitle>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item link title="Stalkers" @click="switchTab(0)"></v-list-item>
      <v-list-item link title="Contacts" @click="switchTab(1)"></v-list-item>
      <!-- <v-list-item link title="Locations" @click="switchTab(2)"></v-list-item> -->
      <template v-slot:append>
        <v-btn class="" block color="success" @click="newCampaignOverlay = !newCampaignOverlay">New Campaign</v-btn>
        <v-btn class="" block color="error" @click="deleteCampaignOverlay = !deleteCampaignOverlay">Delete
          Campaign</v-btn>
      </template>

      <v-overlay v-model="newCampaignOverlay" class="align-center justify-center">
        <v-text-field contained="true" name="name" label="Name" placeholder="value" v-model="newCampaignName"
          style="min-width: 10rem;"></v-text-field>
        <v-btn color="success" @click="newCampaign(); newCampaignOverlay = false">Create</v-btn>
      </v-overlay>
      <v-overlay v-model="deleteCampaignOverlay" class="align-center justify-center">
        <v-sheet class="pa-5" rounded>
          <p>Type in your <span class="text-error">campaign</span> name to delete it</p>
          <br>
          <v-text-field contained="true" name="name" label="Name" placeholder="value" v-model="CampaignName"
            style="min-width: 10rem;"></v-text-field>
          <v-divider></v-divider>
          <br>
          <v-btn class="ma-1" color="success" @click="deleteCampaignOverlay = false">Cancel</v-btn>
          <v-btn class="ma-1" color="error" @click="deleteCampaign(); deleteCampaignOverlay = false">Delete</v-btn>
        </v-sheet>

      </v-overlay>
    </v-navigation-drawer>
    <v-main>
      <Stalker :campaign="selectedCampaign" :isActive="tabs[0]" :key="selectedCampaign" />

      <Contact :campaign="selectedCampaign" :isActive="tabs[1]" :key="selectedCampaign" />
    </v-main>
  </v-app>
  <v-text-field v-if="campaigns.length === 0" contained="true" name="name" label="Campaign name" placeholder="Campaign"
    v-model="newCampaignName"></v-text-field>
  <v-btn v-if="campaigns.length === 0" color="success"
    @click="newCampaign(); selectedCampaign = campaigns[0]">Create</v-btn>
</template>
