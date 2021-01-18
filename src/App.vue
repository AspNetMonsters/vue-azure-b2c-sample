<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">


        <h1>Azure B2C Sample</h1>
      </div>

      <v-spacer></v-spacer>
        <button v-if="!isAuthenticated" @click="signIn()">Sign In</button>

        <button v-if="isAuthenticated" @click="signOut()">Sign Out</button>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
  @Prop() private msg!: string;

  public get isAuthenticated(): boolean {
    return this.$msal.isAuthenticated;
  }

  public async signIn() {
    await this.$msal.signIn();
  }

   public async signOut() {
    await this.$msal.signOut();
  }
}
</script>
