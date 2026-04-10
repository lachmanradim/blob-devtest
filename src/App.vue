<template>
    <VApp>
        <VMain>
            <RouterView />
            <Snackbar />
        </VMain>
    </VApp>
</template>

<script setup lang="ts">
import Snackbar from "./shared/components/SnackbarMessages.vue";
</script>
