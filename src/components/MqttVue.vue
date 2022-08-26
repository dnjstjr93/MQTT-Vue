<template>
    <v-card>
        <v-toolbar
            color="indigo"
            dark
            height="50"
        >
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn
                    text
                    style="font-size: 16px;"
                    class="font-weight-bold"
                    @click="onPublish(true)"
                >
                    Publish
                </v-btn>
                <v-divider vertical></v-divider>
                <v-btn
                    text
                   style="font-size: 16px;"
                   class="font-weight-bold"
                    @click="onPublish(false)"
                >
                    Subscribe
                </v-btn>
                <v-divider vertical></v-divider>
            </v-toolbar-items>
        </v-toolbar>

        <v-row v-if="publishFlag">
            <v-col cols="1" align-self="center">
                <div class="mt-1 ml-6" style="font-size: 20px; font-weight: bold">Topic</div>
            </v-col>
            <v-col cols="4">
                <v-text-field
                    class="pl-n16 mt-2"
                    filled outlined dense hide-details
                    label="Publish Topic"
                    v-model="pub_topic"
                    style="font-size: 15px"
                    required
                    :disabled="publishFlag"
                ></v-text-field>
            </v-col>
            <v-col cols="1" align-self="center">
                <v-btn class="mt-2 font-weight-bold"
                       color="primary"
                       elevation="5"
                       @click="doPublish"
                >Publish
                </v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="4" align-self="end">
                <v-row>
                    <v-chip-group
                        class="ml-4 font-weight-bold"
                        mandatory
                        active-class="primary--text"
                    >
                        <v-chip
                            v-for="tag in qosList"
                            :key="tag.label"
                            @click="setQoS(tag.value)"
                        >
                            {{ tag.label }}
                        </v-chip>
                    </v-chip-group>
                    <v-chip-group
                        class="font-weight-bold"
                        active-class="primary--text"
                    >
                        <v-chip
                            class="font-weight-bold"
                            :key="false"
                            @click="setRetain"
                        >
                            Retain
                        </v-chip>
                    </v-chip-group>
                </v-row>
            </v-col>
        </v-row>
        <v-divider v-if="publishFlag" class="my-3"></v-divider>
        <v-row v-if="publishFlag">
            <div class="mt-1 ml-6 mb-2" style="font-size: 20px; font-weight: bold">Message</div>
        </v-row>
        <v-row v-if="publishFlag" class="mx-3" style="height: 100%">
            <v-textarea
                solo no-resize outlined
                name="input-7-4"
                height="600"
                label="Message"
                v-model="pub_message"
            ></v-textarea>
        </v-row>

        <v-row v-if="!publishFlag">

        </v-row>
    </v-card>
</template>

<script>
import EventBus from "@/EventBus";
import {nanoid} from "nanoid";
import mqtt from "mqtt";

export default {
    name: 'MqttVue',
    data() {
        return {
            MQTT_CONNECTION_CONNECTED: (localStorage.getItem('mqtt_connected') === 'true') ? localStorage.getItem('mqtt_connected') : false,
            connection: {
                host: this.$store.state.VUE_APP_MQTT_HOST,
                port: this.$store.state.VUE_APP_MQTT_PORT,
                protocol: this.$store.state.VUE_APP_MQTT_PROTOCOL,
                endpoint: '/mqtt',
                clean: true, // Reserved session
                connectTimeout: 4000, // Time out
                reconnectPeriod: 4000, // Reconnection interval
                clientId: 'mqtt_vue_' + nanoid(15),
            },
            client: {
                connected: false,
            },
            subscribeSuccess: false,
            qosList: [
                {label: 'QoS 0', value: 0},
                {label: 'QoS 1', value: 1},
                {label: 'QoS 2', value: 2},
            ],

            publishFlag: true,
            pub_topic: '',
            pub_message: '',
            pub_qos: '',
            pub_retain: ''
        }
    },
    methods: {
        createConnection() {
            if (this.$store.state.client.connected) {
                console.log('There is already a connected client. Destroyed connection and then reconnect.');
                this.destroyConnection()
            }
            if (!this.$store.state.client.connected) {
                const {port, protocol, endpoint, ...options} = this.connection
                const serverip = this.$store.state.VUE_APP_MQTT_HOST
                const connectUrl = `${protocol}://${serverip}:${port}${endpoint}`

                try {
                    this.$store.state.client = mqtt.connect(connectUrl, options)
                } catch (error) {
                    console.log('mqtt.connect error', error)
                }
                this.$store.state.client.on('connect', () => {
                    console.log(' (' + protocol + '://' + serverip + ':' + port + ') Connection succeeded!')

                    let topic = '/#'
                    let qos = 0
                    this.$store.state.client.unsubscribe(topic)
                    this.$store.state.client.subscribe(topic, {qos}, (error, res) => {
                        if (error) {
                            console.log('Subscribe to topics error', error)
                        }
                        this.subscribeSuccess = true
                        console.log('Subscribe to topics res', res)
                    })

                    // this.topicList.push({"name": 'Mobius', children: [{"name": "KETI_MUV"}]})
                    //
                    // this.topicList.push({"name": 'oneM2M', children: []})
                })
                this.$store.state.client.on('error', error => {
                    console.log('Connection failed', error)
                })
                this.$store.state.client.on('message', (topic, message) => {
                    console.log(`Received message ${message.toString()} from topic ${topic}`)
                })
            }
        },
        doPublish() {
            if (this.$store.state.client.connected) {
                this.$store.state.client.publish(this.pub_topic, Buffer.from(this.pub_message), {
                    qos: this.pub_qos,
                    retain: this.pub_retain
                })
            }
        },
        destroyConnection() {
            if (this.$store.state.client.connected) {
                try {
                    if (Object.hasOwnProperty.call(this.$store.state.client, '__ob__')) {
                        this.$store.state.client.end()
                    }

                    this.$store.state.client = {
                        connected: false,
                        loading: false
                    }
                    console.log('Successfully disconnected!')
                } catch (error) {
                    this.$store.state.client = {
                        connected: false,
                        loading: false
                    };
                    console.log('Disconnect failed', error.toString())
                }
            }
        },
        onPublish(flag) {
            this.publishFlag = flag
        },
        setQoS(qos) {
            this.pub_qos = qos
        },
        setRetain() {
            this.pub_retain = !this.pub_retain
        }
    },
    mounted() {
        EventBus.$on('mqttConnection', () => {
            if (this.$store.state.MQTT_CONNECTION_CONNECTED) {
                this.createConnection()
            } else {
                this.destroyConnection()
            }
        });
    },
    beforeDestroy() {
        this.destroyConnection()
    }
}
</script>
