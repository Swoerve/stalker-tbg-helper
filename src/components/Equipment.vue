<template>
    <v-container>
        <title>Equipment</title>
        <v-row>
            <v-col v-for="(item, index) in stalker.equipment"
            :key="index"
            cols="6"
            >
                <v-card class="ma-2">
                    <v-card-title class="pb-0 text-h4 text-yellow-accent-3 font-weight-bold">{{ item.name }}</v-card-title>
                    <v-card-subtitle class="text-subtitle1">{{ (item.type) }}</v-card-subtitle>
                    <!-- <v-card-subtitle class="text-subtitle1">{{ (item.id) }}</v-card-subtitle> -->
                    <v-card-subtitle v-if="item.personal" class="text-subtitle1">{{ (item.personalStalker) }}</v-card-subtitle>
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
                        New Equipment
                        <v-overlay v-model="overlay" class="align-center justify-center">
                            <v-card class="pa-3" width="250">
                                <v-card-title primary-title>
                                    New Equipment
                                </v-card-title>
                                <v-form @submit.prevent="submit">
                                    <v-text-field 
                                    contained="true" 
                                    name="name" 
                                    label="Name" 
                                    placeholder="name"
                                    style="min-width: 10rem;"
                                    v-model="equipmentName"
                                    :rules="equipmentRule"></v-text-field>
                                    <v-radio-group v-model="equipmentType" label="Type">
                                        <v-radio color="yellow" label="Armor" value="armor"></v-radio>
                                        <v-radio color="yellow" label="Weapon" value="Weapon"></v-radio>
                                        <v-radio color="yellow" label="Attachment" value="Attachment"></v-radio>
                                        <v-radio color="yellow" label="Artifact" value="Artifact"></v-radio>
                                        <v-radio color="yellow" label="Item" value="Item"></v-radio>
                                    </v-radio-group>
                                    <v-switch label="Personal" v-model="equipmentPersonal" color="yellow"></v-switch>
                                    <v-text-field v-if="equipmentPersonal"
                                    contained="true"
                                    name="name"
                                    label="Stalker"
                                    placeholder="name"
                                    style="min-width: 10rem;"
                                    v-model="equipmentStalker"></v-text-field>
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

// const props = defineProps({
//     stalker: {
//         type: game.Stalker,
//         required: true
//     }
// })
// const {stalker} = toRefs(props)

const stalker = defineModel('stalker', {type: game.Stalker, required: true})

let equipmentName = ref('')
let equipmentType = ref('armor')
let equipmentPersonal = ref(false)
let equipmentStalker = ref('')
let overlay = ref(false)

let equipmentRule = [(value: string) => {
  return value ? true : 'You must enter a name'
}]

let loading = ref(false)
async function submit(event: SubmitEventPromise){
  loading.value = true

  const results = await event

  

  console.log(JSON.stringify(results, null, 2))
  if(results.valid){
    createItem()
    overlay.value = false
  }
  loading.value = false
}


function createItem(){
    
    console.log('creating Equipment...')
    stalker.value.addEquipment(equipmentName.value, equipmentType.value, game.generateId(stalker.value.equipment), equipmentPersonal.value, equipmentStalker.value)
    console.log(stalker.value.equipment[0])
    
}

function removeItem(id: string){
    console.log('deleting stalker...')
    let toDeleteStalker = stalker.value.equipment.findIndex((value, index, array) => {
        return value.id === id
    })
    console.log(toDeleteStalker)
    stalker.value.equipment.splice(toDeleteStalker, 1)
}

</script>