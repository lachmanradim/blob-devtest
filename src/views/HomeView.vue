<template>
    <v-container>
        <v-row justify="center" class="mt-8">
            <v-col cols="12" sm="8" md="6">
                <v-card elevation="2" rounded="lg">
                    <v-card-title class="text-h5 pa-6"> Vítej v projektu! </v-card-title>
                    <v-card-text>
                        <p class="text-body-1">
                            Vue 3 + Composition API + TypeScript + Vuetify + SCSS
                        </p>
                    </v-card-text>
                    <v-card-actions class="pa-6 pt-0">
                        <v-btn color="primary" variant="elevated" @click="count++">
                            Kliknutí: {{ count }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>
