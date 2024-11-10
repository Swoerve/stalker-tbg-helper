<template>
    <v-container v-show="isActive" class="ma-0 pa-0">
        <v-container v-show="isActive" class="d-flex">
            <v-text-field class="h-auto ma-1" label="Name" v-model="stalkerName"></v-text-field>
            <v-text-field class="h-auto ma-1" label="Player" v-model="playerName"></v-text-field>
            <v-btn class="ma-1 h-auto" color="success" @click="createStalker">Create Stalker</v-btn>
        </v-container>
        <v-container class="d-flex" v-show="isActive" v-for="stalker in campaign.stalkers">
            <v-card class="w-100">
                <v-card-title class="pb-0 text-h4 text-yellow-accent-3 font-weight-bold">{{ stalker.name }}</v-card-title>
                <v-card-subtitle class="text-subtitle1">{{ (stalker.player) }}</v-card-subtitle>
                <v-card-actions>
                    <v-btn color="error" @click="deleteStalker(stalker.name)">Kill</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-container>
</template>

<script setup lang="ts">

import { defineComponent, ref, toRefs, toRef, VueElement } from 'vue';
import * as game from '../campaign'
import type { Ref } from 'vue'

const props = defineProps({
    campaign: {
        type: game.Campaign,
        required: true
    },
    isActive: Boolean
})
const {campaign, isActive} = toRefs(props)
//const campaign = toRef(props.campaign)
//const isActive = toRef(props.isActive)

let stalkerName = ref('')
let playerName = ref('')
function createStalker(){
    console.log('creating stalker...')
    if(playerName.value && stalkerName.value){
        campaign.value.newStalker(stalkerName.value, playerName.value)
    }
    else{
        alert("You need to input both player and stalker names")
    }
}

function deleteStalker(name: string){
    console.log('deleting stalker...')
    let toDeleteStalker = campaign.value.stalkers.findIndex((value, index, array) => {
        return value.name === name
    })
    console.log(toDeleteStalker)
    campaign.value.stalkers.splice(toDeleteStalker, 1)



}

</script>