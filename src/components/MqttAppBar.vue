<template>
    <v-card>
        <v-app-bar app dark dense height="50">
            <v-toolbar-title>
                <div no-gutters class="mr-16" align="center" style="font-size: 23px; font-weight: bold; color: white">
                    <font-awesome-icon class="mr-1" icon="wifi" size="1x"/>
                    KETI MQTT-Vue
                </div>
            </v-toolbar-title>

            <v-row no-gutters class="text-right justify-center mt-1">
                <v-col cols="2">
                    <v-select
                        class="mr-2"
                        v-model="default_protocol"
                        :items="protocol"
                        label="PROTOCOL*"
                        dense dark hide-details outlined
                        style="font-size: 18px;"
                        :disabled="MQTT_CONNECTION_CONNECTED"
                    ></v-select>
                </v-col>
                <v-col cols="2">
                    <v-text-field
                        dense dark hide-details outlined
                        ref="host"
                        v-model="host" :rules="host_rule"
                        placeholder="gcs.iotocean.org"
                        label="HOST*"
                        style="font-size: 18px;"
                        required
                        :disabled="MQTT_CONNECTION_CONNECTED"
                    ></v-text-field>
                </v-col>
                <v-col cols="1">
                    <v-text-field
                        class="mx-2"
                        dense dark hide-details outlined
                        ref="rc"
                        v-model="port" :rules="port_rule"
                        placeholder="1883"
                        label="PORT*"
                        style="font-size: 18px;"
                        required
                        :disabled="MQTT_CONNECTION_CONNECTED"
                    ></v-text-field>
                </v-col>
                <v-col cols="4" align-self="center">
                    <v-btn
                        class="mx-2 mt-n1 rounded-lg"
                        tile @click="GcsAppBarCreated"
                        elevation="4"
                        color="success"
                        style="font-size: 18px;"
                        height="40"
                        :disabled="MQTT_CONNECTION_CONNECTED"
                    > {{ MQTT_CONNECTION_TEXT }}
                    </v-btn>
                    <v-btn
                        class="mx-2 mt-n1 rounded-lg"
                        tile @click="GcsAppBarReseted"
                        elevation="2"
                        color="error"
                        style="font-size: 18px;"
                        height="40"
                        :disabled="!MQTT_CONNECTION_CONNECTED"
                    > {{ MQTT_DISCONNECTION_TEXT }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-app-bar>
    </v-card>
</template>

<script>
import EventBus from "@/EventBus";

export default {
    name: "RCAppBar",
    data: function () {
        return {
            MQTT_DISCONNECTION_TEXT: 'Disconnect',
            MQTT_CONNECTION_TEXT: 'Connect',
            MQTT_CONNECTION_CONNECTED: false,

            protocol: ['mqtt', 'ws'],
            default_protocol: 'mqtt',
            host: localStorage.getItem('mqtt_host') ? (localStorage.getItem('mqtt_host')) : (this.$store.state.VUE_APP_MQTT_HOST),
            host_rule: [
                v => !!v || 'HOST 주소는 필수 입력사항입니다.',
                v => !/[~!@#$%^&*()+|<>?{}]/.test(v) || 'HOST 주소에는 특수문자를 사용할 수 없습니다.',
                v => !!/[:]/.test(v) || '올바른 HOST 주소가 아닙니다.',
                v => !!(v && (v.split('.')).length === 4 || v.includes('localhost')) || '올바른 HOST 주소가 아닙니다.',
            ],
            port: localStorage.getItem('mqtt_port') ? (localStorage.getItem('mqtt_port')) : (this.$store.state.VUE_APP_MQTT_PORT),
            port_rule: [
                v => !!v || '포트 번호는 필수 입력사항입니다.',
                v => /^[.0-9]*$/.test(v) || '포트 번호는 숫자만 입력 가능합니다.',
            ]
        }
    },
    methods: {
        GcsAppBarCreated() {
            this.$store.state.VUE_APP_MQTT_PROTOCOL = this.protocol
            this.$store.state.VUE_APP_MQTT_HOST = this.host
            this.$store.state.VUE_APP_MQTT_PORT = this.port
            this.MQTT_CONNECTION_CONNECTED = true
            this.$store.state.MQTT_CONNECTION_CONNECTED = true

            localStorage.setItem('mqtt_host', this.host)
            localStorage.setItem('mqtt_port', this.port)
            localStorage.setItem('mqtt_protocol', this.protocol)

            EventBus.$emit('mqttConnection')
        },
        GcsAppBarReseted() {
            this.MQTT_CONNECTION_CONNECTED = false
            this.$store.state.MQTT_CONNECTION_CONNECTED = false

            EventBus.$emit('mqttConnection')
        }
    },
    mounted() {
        if (this.MQTT_CONNECTION_CONNECTED) {
            this.GcsAppBarCreated();
        }
    },
    beforeDestroy() {
        this.GcsAppBarReseted()
    }
}
</script>

<style scoped>
#create .v-speed-dial {
    position: absolute;
}

#create .v-btn--floating {
    position: relative;
}

.v-text-field >>> label {
    font-size: 0.8em;
}

.baricon {
    color: white;
}
</style>
