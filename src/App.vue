<template>
    <VApp>
        <VMain>
            <VContainer class="fill-height">
                <VRow justify="center" class="fill-height">
                    <VCol cols="12" class="fill-height">
                        <RouterView />
                    </VCol>
                </VRow>
            </VContainer>
            <Snackbar />
        </VMain>
    </VApp>
</template>

<script setup lang="ts">
import Snackbar from "./shared/components/Snackbar.vue";
</script>

<style lang="scss">
@use "../styles/main";
</style>
