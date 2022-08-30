<template>
    <v-app>
        <v-main style="background-color: #424242">
            <MqttAppBar/>
            <router-view>></router-view>
        </v-main>
    </v-app>
</template>

<script>

import MqttAppBar from "./components/MqttAppBar";

export default {
    name: 'App',

    components: {
        MqttAppBar
    }
}
</script>

<style>
::-webkit-scrollbar {
    display: none;
}
</style>
