<template>
  <v-container>
    <v-alert
      v-if="!$msal.isAuthenticated"
      class="d-flex align-center"
      border="top"
      colored-border
      type="info"
      elevation="2"
    >
      Welcome to Dave Co. Sign in to see our super top secret things.
    </v-alert>
    <v-card  v-if="$msal.isAuthenticated" class="mx-auto" elevation="2"  max-width="374">
      <v-card-title>Welcome to Dave Co.!</v-card-title>
      <v-card-text>
        Super secret info will go here once we wire it up to call our API!
        
      </v-card-text>
      <v-card-actions>
        <v-btn @click="getSecret()">Get your secret!</v-btn>
      </v-card-actions>
            <v-card-text v-if="secretThing">
          {{secretThing}}
        
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DaveCoApi from "../api/daveco-api";

@Component({
  components: {},
})
export default class Home extends Vue {

   public secretThing = '';
   
   getSecret() {
     this.secretThing = DaveCoApi.getSuperSecretThings();
  }
}
</script>
