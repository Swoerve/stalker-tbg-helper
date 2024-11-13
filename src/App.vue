<script setup lang="ts">
import { ref, onMounted, computed, watch, reactive } from "vue"
import type { Ref } from 'vue'
import * as game from './campaign'
import Stalker from "./components/Stalker.vue"
import Contact from "./components/Contact.vue"
import { auth, database } from "./firebase"

import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref as dbRef, set, child, get } from "firebase/database";


const user = ref(auth.currentUser || null)
const overlaySignIn = ref(true)

// new campaign reference to be populated later on or inserted a new campaign
const campaigns: Ref<game.Campaign[]> = ref([])

onAuthStateChanged(auth, (userr) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    //const uid = userr.uid;
    user.value = userr
    console.log('user signed in state')
    if(user.value){
      get(child(dbRef(database), user.value.uid)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          console.log(snapshot.val().campaigns);
          
          console.log('localstorage exists')
          let load = snapshot.val().campaigns
          campaigns.value = []
          for (let key in load) {
            // console.log(key, load[key])
            campaigns.value.push(game.Campaign.fromSerialized(load[key]))
          }
          // console.log('mounting id ' + campaigns.value[0].id)
          selectedCampaign.value = campaigns.value[0]
          
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    console.log("Logged In")
    overlaySignIn.value = false
    }
    // ...
  } else {
    // User is signed out
    // ...
    //user.value = null
  }
});

//if(user.value){
//  console.log("Logged In")
//  overlaySignIn.value = false
//}


const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'http://localhost:5173/stalker-tbg-helper/',
  // This must be true.
  handleCodeInApp: true,
};

import {sendSignInLinkToEmail } from "firebase/auth";
const emailForSignIn = ref('')
const signInLoading = ref(false)
function signInButton(){
  signInLoading.value = true
  sendSignInLinkToEmail(auth, emailForSignIn.value, actionCodeSettings)
  .then(() => {
    // The link was successfully sent. Inform the user.
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    window.localStorage.setItem('emailForSignIn', emailForSignIn.value);
    signInLoading.value = false
    
    // ...
    
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });
}

function signOutButton(){
  signOut(auth).then(() => {

  }).catch((error) => {

  })
}


import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

// Confirm the link is a sign-in with email link.
if (isSignInWithEmailLink(auth, window.location.href)) {
  console.log("link is email sign in link")
  // Additional state parameters can also be passed via URL.
  // This can be used to continue the user's intended action before triggering
  // the sign-in operation.
  // Get the email if available. This should be available if the user completes
  // the flow on the same device where they started it.
  let email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    // User opened the link on a different device. To prevent session fixation
    // attacks, ask the user to provide the associated email again. For example:
    console.log("email was not opened on same device")
    email = window.prompt('Please provide your email for confirmation');
  }
  // The client SDK will parse the code from the link for you.
  signInWithEmailLink(auth, email || '', window.location.href)
    .then((result) => {
      // Clear email from storage.
      window.localStorage.removeItem('emailForSignIn');
      // You can access the new user by importing getAdditionalUserInfo
      // and calling it with result:
      // getAdditionalUserInfo(result)
      // You can access the user's profile via:
      // getAdditionalUserInfo(result)?.profile
      // You can check if the user is new or existing:
      // getAdditionalUserInfo(result)?.isNewUser
      console.log("user verified")
    })
    .catch((error) => {
      // Some error occurred, you can inspect the code: error.code
      // Common errors could be invalid email and invalid or expired OTPs.
    });
}




// the selected campaign
const selectedCampaign = ref()

//new campaign stuff
const newCampaignOverlay = ref(false) // the overlay for making a new campaign
const newCampaignName = ref('') // the name for the new campaign

// delete campaign stuff
const deleteCampaignOverlay = ref(false) // the overlay for deleting a campaign
const CampaignName = ref('') // the name that the campaign to be deleted has


// watches for any changes made to campaign deeply, and then saves a stringify'ed version of campaign into local storage
watch(campaigns, (newVal) => {

  let save: { [k: string]: any } = {}
  newVal.forEach(cmpgn => {
    save[cmpgn.name] = (cmpgn.serialize())
  })
  if (user.value && database){
    set(dbRef(database, user.value.uid), {
      email: user.value.email,
      campaigns: save
    })
    console.log('saved to db')
  }
  localStorage.setItem('campaigns', JSON.stringify(save))
}, { deep: true })

// when the site has finished loading then check localstorage for already existing campaigns and load them
onMounted(() => {

  console.log('mounted')
  // if (localStorage.getItem('campaigns')) {
  //   console.log('localstorage exists')
  //   let load = JSON.parse(localStorage.getItem('campaigns') as string)
  //   campaigns.value = []
  //   for (let key in load) {
  //     // console.log(key, load[key])
  //     campaigns.value.push(game.Campaign.fromSerialized(load[key]))
  //   }
  //   // console.log('mounting id ' + campaigns.value[0].id)
  //   selectedCampaign.value = campaigns.value[0]
  // }
})

// creates a new campaign
function newCampaign() {
  // console.log(campaigns)
  // console.log(campaigns.value.length)
  let newId = game.generateId(campaigns.value)
  let newCampaignObject = new game.Campaign(newCampaignName.value, newId)
  // console.log(newCampaignObject)
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
  // console.log('switching tabs')
  for (let i = 0; i < tabs.length; i++) {
    tabs[i] = false
    if (i === n) {
      tabs[i] = true
    }
  }
  // console.log(tabs)
}

// console.log('selected:' + selectedCampaign.value)
</script>

<template>
  <v-app>
    <v-layout>
      <v-app-bar permanent density="compact" flat>
        <template v-if="user">
          {{ user.email }}
        </template>
        <template v-if="!user">
          not logged in
        </template>
        <template v-slot:append>
          <v-btn @click="signOutButton()" v-if="user">sign out</v-btn>
          <v-btn @click="overlaySignIn = !overlaySignIn" v-if="!user">Sign in
            <v-overlay persistent v-model="overlaySignIn" class="align-center justify-center">
              <v-sheet width="250" class="pa-5" rounded>
                <v-form>
                  <v-text-field
                    name="email"
                    label="Email"
                    id="email"
                    type="email"
                    v-model="emailForSignIn"
                  ></v-text-field>
                  <v-btn color="success" :loading="signInLoading" @click="signInButton()">Sign In</v-btn>
                </v-form>
              </v-sheet>
            </v-overlay>
          </v-btn>
        </template>
      </v-app-bar>
      <template  v-if="campaigns.length > 0 && selectedCampaign">
        <v-navigation-drawer app :location="$vuetify.display.mobile ? 'bottom' : undefined" permanent :width="200" class="pt-2">
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
      </template>
      <v-main v-if="campaigns.length === 0">
        <v-container fluid>
          <v-text-field  name="campaign name" label="Campaign name" placeholder="Campaign"
            v-model="newCampaignName"></v-text-field>
          <v-btn color="success"
          @click="newCampaign(); selectedCampaign = campaigns[0]">Create</v-btn>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>
