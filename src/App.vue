

<script setup lang="ts">
import { ref, onMounted, computed, watch, reactive } from "vue"
import type { Ref } from 'vue'
import * as game from './campaign'
//import { RefSymbol } from "@vue/reactivity"
import Stalker from "./components/Stalker.vue"

//let test = new game.Campaign([],[],[],0)
let campaigns: Ref<game.Campaign[]> = ref([])
// let campaign = new game.Campaign('first',0, [],[],[],0)
// let campaign1 = new game.Campaign('second',1, [],[],[],1000)
// campaigns.value.push(campaign)
// campaigns.value.push(campaign1)

let selectedCampaign = ref(0)
let newCampaignOverlay = ref(false)
let newCampaignName = ref('')

const equipment = ref([])


let equipmentName = ref('')
let equipmentType = ref('')
let equipmentPersonal = ref(false)
//const testn = ref(stalkerName)

watch(campaigns, (newVal) => {
  let save: {[k: string]: any} = {}
  newVal.forEach(cmpgn => {
    save[cmpgn.name] = (cmpgn.serialize())
  })
  localStorage.setItem('campaigns', JSON.stringify(save))
}, {deep: true})

onMounted(() => {
  console.log('mounted')
  if(localStorage.getItem('campaigns')){
    console.log('localstorage exists')
    let load = JSON.parse(localStorage.getItem('campaigns') as string)
    campaigns.value = []
    for(let key in load){
      console.log(key, load[key])
      campaigns.value.push(game.Campaign.fromSerialized(load[key]))
    }
    //campaign.value = reactive(game.Campaign.fromSerialized())
    //console.log(JSON.parse(localStorage.getItem('campaign')))
    //console.log(campaign.value)
    //console.log(game.Campaign.fromSerialized(localStorage.getItem('campaign')))
  }
})

function newCampaign(){
  console.log(campaigns)
  console.log(campaigns.value.length)
  let newId = campaigns.value.length
  let newCampaignObject = new game.Campaign(newCampaignName.value, newId)
  console.log(newCampaignObject)
  campaigns.value.push(newCampaignObject)
}

// function createEquipment(){
//   console.log('creating equipment')
//   campaign.value.stalkers[0].addEquipment(equipmentName.value, equipmentType.value, equipmentPersonal.value)
// }


//const activeTab = ref(0)
const tabs = reactive([true, false, false])
function switchTab(n: number){
  console.log('switching tabs')
  for(let i = 0; i < tabs.length; i++){
    tabs[i] = false
    if(i === n){
      tabs[i] = true
    }
  }
  console.log(tabs)
}

</script>

<template>
  <v-app v-if="campaigns.length > 0">
    <v-navigation-drawer app :width="200">
      <v-list-item>
        <v-select
          :items="campaigns"
          item-title="name"
          item-value="id"
          v-model="selectedCampaign"
          density="compact"
          label="Campaign"
        ></v-select>
        <v-list-item-title >{{ campaigns[selectedCampaign].name }}</v-list-item-title>
        <v-list-item-subtitle >Coupons: {{ campaigns[selectedCampaign].coupons }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item link title="Stalkers" @click="switchTab(0)"></v-list-item>
      <v-list-item link title="Contacts" @click="switchTab(1)"></v-list-item>
      <v-list-item link title="Locations" @click="switchTab(2)"></v-list-item>
      <v-btn class="position-absolute bottom-0" block color="success" @click="newCampaignOverlay = !newCampaignOverlay">New Campaign</v-btn>
      <v-overlay v-model="newCampaignOverlay" class="align-center justify-center">
        <v-text-field
          contained="true"
          name="name"
          label="Name"
          placeholder="value"
          v-model="newCampaignName"
          style="min-width: 10rem;"
        ></v-text-field>
        <v-btn color="success" @click="newCampaign(); newCampaignOverlay = false">Create</v-btn>
      </v-overlay>
    </v-navigation-drawer>
    <v-main>
      <Stalker :campaign="campaigns[selectedCampaign]" :isActive="tabs[0]"/>
    </v-main>
  </v-app>
  <v-text-field
    contained="true"
    name="name"
    label="Name"
    placeholder="value"
    v-model="newCampaignName"
  ></v-text-field>
  <v-btn color="success" @click="newCampaign()">Create</v-btn>
</template>