<template>
    <v-card height="775">
        <v-toolbar
            color="indigo"
            dark
            height="50"
        >
            <v-col cols="10">
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
            </v-col>
            <v-col cols="2">
                <h4
                    class="float-end"
                >
                    <v-progress-circular
                        indeterminate
                        color="primary"
                        v-if="connect_status === 'connecting...'"
                    ></v-progress-circular>
                    <font-awesome-icon
                        class=""
                        v-if="connect_status === 'Connection success'"
                        icon="circle"
                        color="green"
                        size="1x"/>
                    <font-awesome-icon
                        class=""
                        v-if="connect_status === 'Please reconnect'"
                        icon="circle"
                        color="red"
                        size="1x"/>
                    {{ connect_status }}
                </h4>
            </v-col>
        </v-toolbar>

        <v-row v-if="publishFlag">
            <v-col cols="1" align-self="center">
                <div class="mt-1 ml-6" style="font-size: 20px; font-weight: bold">Topic</div>
            </v-col>
            <v-col cols="4">
                <v-row class="mt-2">
                    <v-text-field
                        class="pl-n16"
                        filled outlined dense hide-details
                        label="Publish Topic"
                        v-model="pub_topic"
                        style="font-size: 15px"
                        required
                        :disabled="!publishFlag"
                    ></v-text-field>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                class="ml-n12 px-n2"
                                color="primary"
                                dark
                                v-bind="attrs"
                                v-on="on"
                                height="40"
                            >
                                <font-awesome-icon class="mr-1" icon="list" size="1x"/>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item-group
                                v-model="model"
                                color="primary"
                            >
                                <v-list-item
                                    class="my-n3"
                                    v-for="(item, index) in storagePubTopic"
                                    :key="index"
                                    @click="pub_topic=item.title"
                                >
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-menu>
                </v-row>
            </v-col>
            <v-col cols="1" align-self="center">
                <v-btn class="mt-2 font-weight-bold"
                       color="primary"
                       elevation="5"
                       @click="doPublish"
                       height="40"
                       style="font-family: '나눔스퀘어 Bold'"
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
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                class="mt-2"
                                rounded
                                color="primary"
                                dark
                                v-bind="attrs"
                                v-on="on"
                                height="31"
                            >
                                <font-awesome-icon class="mr-1" icon="list" size="1x"/>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item-group
                                v-model="model"
                                color="primary"
                            >
                                <v-list-item
                                    class="my-n3"
                                    v-for="(item, index) in pub_menu"
                                    :key="index"
                                    @click="manClear(item.title)"
                                >
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-menu>
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
        <!------------------------------------------------------------------------------------------------------------->
        <v-row v-if="!publishFlag">
            <v-col cols="1" align-self="center">
                <div class="mt-1 ml-6" style="font-size: 20px; font-weight: bold">Topic</div>
            </v-col>
            <v-col cols="4">
                <v-row class="mt-2">
                    <v-text-field
                        class="pl-n16"
                        filled outlined dense hide-details
                        label="Subscribe Topic"
                        v-model="sub_topic"
                        style="font-size: 15px"
                        required
                        :disabled="publishFlag"
                    ></v-text-field>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                class="ml-n12 px-n2"
                                color="primary"
                                dark
                                v-bind="attrs"
                                v-on="on"
                                height="40"
                            >
                                <font-awesome-icon class="mr-1" icon="list" size="1x"/>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item-group
                                v-model="model"
                                color="primary"
                            >
                                <v-list-item
                                    class="my-n3"
                                    v-for="(item, index) in storageSubTopic"
                                    :key="index"
                                    @click="sub_topic=item.title"
                                >
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-menu>
                </v-row>
            </v-col>
            <v-col cols="1" align-self="center">
                <v-btn class="mt-2 font-weight-bold"
                       color="primary"
                       elevation="5"
                       height="40"
                       @click="doSubscribe"
                       style="font-family: '나눔스퀘어 Bold'"
                >Subscribe
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
                        v-model="autoscroll_flag"
                        class="font-weight-bold"
                        multiple
                        active-class="primary--text"
                    >
                        <v-chip
                            class="font-weight-bold"
                            filter
                            @click="setAutoScroll"
                        >
                            AutoScroll
                        </v-chip>
                        <v-chip
                            class="font-weight-bold"
                            v-if="false"
                            @click="setAutoScroll"
                        >
                            AutoScroll
                        </v-chip>
                    </v-chip-group>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                class="mt-2"
                                rounded
                                color="primary"
                                dark
                                v-bind="attrs"
                                v-on="on"
                                height="31"
                            >
                                <font-awesome-icon class="mr-1" icon="list" size="1x"/>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item-group
                                v-model="model"
                                color="primary"
                            >
                                <v-list-item
                                    class="my-n3"
                                    v-for="(item, index) in pub_menu"
                                    :key="index"
                                    @click="manSubClear(item.title)"
                                >
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-menu>
                </v-row>
            </v-col>
        </v-row>
        <v-divider v-if="!publishFlag" class="my-3"></v-divider>
        <v-row v-if="!publishFlag" class="ml-1" style="height: 35%">
            <v-col cols="4">
                <div class="font-weight-bold">List</div>
                <v-list dense>
                    <v-list-item-group v-model="model">
                        <template v-for="(item, i) in TopicList">
                            <v-divider
                                v-if="!item"
                                :key="`divider-${i}`"
                                class="mt-n2"
                            ></v-divider>
                            <v-list-item
                                v-else
                                :key="`item-${i}`"
                                :value="item"
                                dense
                                active-class="primary--text text--accent-4"
                                @click="SubTopic=item"
                            >
                                <template v-slot:default="{}">
                                    <v-list-item-content class="mr-n6" justify="space-between">
                                        <v-col class="my-n2 ml-n3">
                                            <v-list-item-title v-text="item"
                                                               style="font-size: 15px">
                                            </v-list-item-title>
                                        </v-col>
                                        <v-col cols="12" class="my-n2 text-right">
                                            <v-btn
                                                rounded
                                                height="20"
                                                style="font-size: 10px"
                                                @click="DumpMessage"
                                            >
                                                Dump Message
                                            </v-btn>
                                            <v-btn
                                                v-if="muteFlag[item]"
                                                rounded
                                                height="20"
                                                color="primary"
                                                style="font-size: 10px"
                                                @click="muteFlag[item]=!muteFlag[item]"
                                            >
                                                Mute
                                            </v-btn>
                                            <v-btn
                                                v-if="!muteFlag[item]"
                                                rounded
                                                height="20"
                                                style="font-size: 10px"
                                                @click="muteFlag[item]=!muteFlag[item]"
                                            >
                                                Mute
                                            </v-btn>
                                            <v-btn
                                                rounded
                                                height="20"
                                                style="font-size: 10px"
                                                @click="doUnsubscribe(item)"
                                            >
                                                Unsubscribe
                                            </v-btn>
                                        </v-col>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                        </template>
                    </v-list-item-group>
                </v-list>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="8" v-scroll.self="onScroll"
            >
                <div class="font-weight-bold">Topic List</div>
                <v-list dense>
                    <v-list-item-group v-model="model">
                        <!--TODO: 스크롤 추가-->
                        <!--TODO: item 선택 시 중복 선택 처리-->
                        <template v-for="(item, i) in SubTopicList">
                            <v-divider
                                v-if="!item"
                                :key="`divider-${i}`"
                                class="mt-n2"
                            ></v-divider>
                            <v-list-item
                                v-else
                                :key="`item-${i}`"
                                :value="item"
                                dense
                                active-class="primary--text text--accent-4"
                                @click="SelectTopic = item"
                            >
                                <template v-slot:default="{ active }">
                                    <v-list-item-content>
                                        <v-col cols="10">
                                            <v-list-item-title v-text="item"
                                                               style="font-size: 15px">
                                            </v-list-item-title>
                                        </v-col>

                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <v-chip :input-value="active">
                                            {{ msgIndexList[i] }}
                                        </v-chip>
                                    </v-list-item-action>
                                </template>
                            </v-list-item>
                        </template>
                    </v-list-item-group>
                </v-list>
            </v-col>
        </v-row>
        <v-divider class="mt-3"></v-divider>
        <v-row class="ml-1 mt-1 fill-height">
            <v-col cols="4">
                <v-row class="mt-n4">
                    <v-col cols="5">
                        <span class="font-weight-bold">Topics Collector</span>
                    </v-col>
                    <v-col cols="7" class="text-right">
                        <v-btn
                            rounded
                            height="25"
                            width="40"
                            @click="setScan"
                            :disabled="ScanFlag"
                        >Scan
                        </v-btn>
                        <v-btn
                            class="mx-1"
                            rounded
                            height="25"
                            width="40"
                            @click="setStop"
                            :disabled="!ScanFlag"
                        >Stop
                        </v-btn>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    rounded
                                    color="primary"
                                    dark
                                    v-bind="attrs"
                                    v-on="on"
                                    height="25"
                                >
                                    <font-awesome-icon class="mr-1" icon="list" size="1x"/>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item-group
                                    v-model="model"
                                    color="primary"
                                >
                                    <v-list-item
                                        class="my-n3"
                                        v-for="(item, index) in items"
                                        :key="index"
                                        @click="manList(item.title)"
                                    >
                                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                                    </v-list-item>
                                </v-list-item-group>
                            </v-list>
                        </v-menu>
                    </v-col>
                </v-row>
                <v-row>
                    <v-card width="430">
                        <v-list dense class="ml-n2">
                            <v-list-item-group v-model="model">
                                <template v-for="(item, i) in ScanTopics">
                                    <v-divider
                                        v-if="!item"
                                        :key="`divider-${i}`"
                                        class="mt-n2"
                                    ></v-divider>
                                    <v-list-item
                                        v-else
                                        :key="`item-${i}`"
                                        :value="item"
                                        dense
                                        active-class="primary--text text--accent-4"
                                        @click="scanTopic=item"
                                        @dblclick="doScanSubscribe(item)"
                                    >
                                        <template v-slot:default="{ active }">
                                            <v-list-item-content>
                                                <v-list-item-title v-text="item"
                                                                   style="font-size: 15px"></v-list-item-title>
                                            </v-list-item-content>

                                            <v-list-item-action>
                                                <v-checkbox
                                                    :input-value="active"
                                                    color="primary accent-4"
                                                ></v-checkbox>
                                            </v-list-item-action>
                                        </template>
                                    </v-list-item>
                                </template>
                            </v-list-item-group>
                        </v-list>
                    </v-card>
                </v-row>
            </v-col>
            <v-divider vertical class="mt-n1"></v-divider>
            <v-col cols="8">
                <v-row v-if="!publishFlag" class="mr-2">
                    <v-col cols="3">
                        <div class="ml-3 mt-2 font-weight-bold">Payload</div>
                    </v-col>
                    <v-col cols="9" class="text-right">
                        <span class="font-weight-bold">Payload decoded by  </span>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    color="primary"
                                    dark
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    {{ Decoder }}
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item-group
                                    v-model="model"
                                    color="primary"
                                >
                                    <v-list-item
                                        v-for="(item, index) in decoded"
                                        :key="index"
                                        @click="Decoder=item.title"
                                    >
                                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                                    </v-list-item>
                                </v-list-item-group>
                            </v-list>
                        </v-menu>
                    </v-col>
                </v-row>
                <v-row v-if="!publishFlag" class="mx-3" style="height: 100%">
                    <v-card class="ml-n1" height="300" width="1000" elevation="5">
                        <v-textarea
                            class="mx-3 my-1 font-weight-bold"
                            style="font-size: 15px"
                            rows="11"
                            row-height="300"
                            v-model="sub_message"
                        ></v-textarea>
                    </v-card>
                </v-row>
            </v-col>
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
                reconnectPeriod: 0, // Reconnection interval
                clientId: 'mqtt_vue_' + nanoid(15),
            },
            client: {
                connected: false,
            },
            connect_status: '',
            subscribeSuccess: false,
            qosList: [
                {label: 'QoS 0', value: 0},
                {label: 'QoS 1', value: 1},
                {label: 'QoS 2', value: 2},
            ],

            publishFlag: true,

            pub_topic: '',
            pub_message: '',
            pub_menu: [{title: 'Clear All Topics'}, {title: "Clear Messages"}],
            storagePubTopic: (localStorage.getItem('PublishTopics')) ? (localStorage.getItem('PublishTopics')) : (this.$store.state.storagePubTopic),

            sub_topic: '',
            sub_message: '',
            storageSubTopic: (localStorage.getItem('SubscribeTopics')) ? (localStorage.getItem('SubscribeTopics')) : (this.$store.state.storageSubTopic),

            qos: 0,
            retain: false,

            AutoScroll: true,
            autoscroll_flag: [0],

            model: 1,
            TopicList: [''],
            SubTopicList: [''],
            SubTopic: null,
            SelectTopic: null,

            ScanTopics: [''],
            scanTopic: null,
            ScanFlag: false,

            muteFlag: {},
            opacity: 0.4,
            absolute: true,

            scrollInvoked: 0,

            msgIndex: 0,
            msgIndexList: [''],

            decoded: [
                {title: 'Plane Text Decoder'},
                {title: "JSON Pretty format Decoder"},
                {title: "Base64 Decoder"},
                {title: "Hex Format Decoder"}
            ],
            Decoder: 'Hex Format Decoder',
            items: [{title: 'Copy All'}, {title: "Copy"}, {title: "Clear"}]
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
                const serverport = localStorage.getItem('mqtt_port')
                const connectUrl = `${protocol}://${serverip}:${serverport}${endpoint}`

                try {
                    this.$store.state.client = mqtt.connect(connectUrl, options)
                    this.connect_status = 'connecting...'
                } catch (error) {
                    console.log('mqtt.connect error', error)
                    this.connect_status = 'Please reconnect'
                    this.$store.state.MQTT_CONNECTION_CONNECTED = false
                }
                this.$store.state.client.on('connect', () => {
                    this.connect_status = 'Connection success'
                    setTimeout(() => {
                        this.connect_status = ''
                    }, 2000)

                    console.log(' (' + protocol + '://' + serverip + ':' + port + ') Connection succeeded!')

                    // let topic = '/#'
                    // let qos = 0
                    // this.$store.state.client.unsubscribe(topic)
                    // this.$store.state.client.subscribe(topic, {qos}, (error, res) => {
                    //     if (error) {
                    //         console.log('Subscribe to ' + topic + ' error', error)
                    //     }
                    //     console.log('Subscribe to ' + topic + ' res', res)
                    // })
                })
                this.$store.state.client.on('error', error => {
                    console.log('Connection failed', error)
                    this.connect_status = 'Please reconnect'
                    this.$store.state.MQTT_CONNECTION_CONNECTED = false
                })
                this.$store.state.client.on('message', (topic, message) => {
                    // console.log(`Received message ${message.toString()} from topic ${topic}`)
                    this.TopicList.forEach((subtopic) => {
                        if (topic.includes(subtopic.replace('/#', ''))) {
                            if (this.muteFlag[subtopic] === false) {
                                this.SubTopicList.push(topic)
                                this.msgIndexList.push(++this.msgIndex)
                                this.SubTopicList.push('')
                                this.msgIndexList.push('')

                                if (this.Decoder === 'Hex Format Decoder') {
                                    try {
                                        this.sub_message = message.toString('hex')
                                    } catch (e) {
                                        console.log("Can't parse message :", message)
                                    }
                                } else if (this.Decoder === 'JSON Pretty format Decoder') {
                                    try {
                                        JSON.parse(message)
                                        this.sub_message = message
                                    } catch (e) {
                                        this.sub_message = "*** PAYLOAD IS NOT VALID JSON DATA ***\r\n" + e.message
                                        console.log("*** PAYLOAD IS NOT VALID JSON DATA ***\r\n" + e.message)
                                    }
                                } else if (this.Decoder === 'Base64 Decoder') {
                                    try {
                                        this.sub_message = message.toString('base64')
                                    } catch (e) {
                                        console.log("Can't parse message :", message)
                                    }
                                } else {
                                    this.sub_message = message
                                }
                            }
                        }
                    })

                    if (this.ScanFlag) {
                        if (!this.ScanTopics.includes(topic)) {
                            this.ScanTopics.push(topic)
                            this.ScanTopics.push('')
                        }
                    }
                })
            }
        },
        doPublish() {
            if (this.$store.state.client.connected) {
                this.$store.state.client.publish(this.pub_topic, Buffer.from(this.pub_message), {
                    qos: this.qos,
                    retain: this.retain
                })
            }

            // eslint-disable-next-line no-unused-vars
            let storage_pub_flag = []
            this.storagePubTopic.forEach((obj_index) => {
                if (obj_index.title !== this.pub_topic) {
                    storage_pub_flag.push(true)
                } else {
                    storage_pub_flag.push(false)
                }
            })
            if (!storage_pub_flag.includes(false)) {
                this.storagePubTopic.push({title: this.pub_topic})
                localStorage.setItem('PublishTopics', JSON.stringify(this.storagePubTopic))
                storage_pub_flag = []
            }
        },
        doSubscribe() {
            if (this.$store.state.client.connected) {
                if (this.sub_topic !== '') {
                    this.$store.state.client.unsubscribe(this.sub_topic, (error, res) => {
                        if (error) {
                            console.log('Unsubscribe to ' + this.sub_topic + ' error', error)
                        }
                        if (res) {
                            console.log('Unsubscribe to ' + this.sub_topic + ' res', res)
                        }
                    })
                    this.$store.state.client.subscribe(this.sub_topic, {qos: this.qos}, (error, res) => {
                        if (error) {
                            console.log('Subscribe to ' + this.sub_topic + ' error', error)
                        }
                        if (res) {
                            console.log('Subscribe to ' + this.sub_topic + ' res', res)
                        }

                        this.muteFlag[this.sub_topic] = false

                        if (!this.TopicList.includes(this.sub_topic)) {
                            this.TopicList.push(this.sub_topic)
                            this.TopicList.push('')
                        }

                        // eslint-disable-next-line no-unused-vars
                        let storage_sub_flag = []
                        this.storageSubTopic.forEach((obj_index) => {
                            if (obj_index.title !== this.sub_topic) {
                                storage_sub_flag.push(true)
                            } else {
                                storage_sub_flag.push(false)
                            }
                        })
                        if (!storage_sub_flag.includes(false)) {
                            this.storageSubTopic.push({title: this.sub_topic})
                            localStorage.setItem('SubscribeTopics', JSON.stringify(this.storageSubTopic))
                            storage_sub_flag = []
                        }
                    })
                }
            }
        },
        doScanSubscribe(item) {
            if (item) {
                this.sub_topic = item
            }
            this.muteFlag[this.sub_topic] = false

            if (!this.TopicList.includes(this.sub_topic)) {
                this.TopicList.push(this.sub_topic)
                this.TopicList.push('')
            }
            if (this.$store.state.client.connected) {
                this.$store.state.client.unsubscribe(this.sub_topic, (error, res) => {
                    if (error) {
                        console.log('Unsubscribe to ' + this.sub_topic + ' error', error)
                    }
                    if (res) {
                        console.log('Unsubscribe to ' + this.sub_topic + ' res', res)
                    }
                })
                this.$store.state.client.subscribe(this.sub_topic, {qos: this.qos}, (error, res) => {
                    if (error) {
                        console.log('Subscribe to ' + this.sub_topic + ' error', error)
                    }
                    if (res) {
                        console.log('Subscribe to ' + this.sub_topic + ' res', res)
                    }
                })
            }
        },
        doUnsubscribe(topic) {
            this.SubTopic = null
            this.TopicList = this.TopicList.filter(
                unsubscribeTopic => unsubscribeTopic !== topic)
            for (let i = 0; i < this.TopicList.length; i++) {
                if (i % 2 === 1) {
                    if (this.TopicList[i] === '') {
                        this.TopicList.splice(i, 1)
                    }
                }
            }
            this.SubTopicList = this.SubTopicList.filter(
                unsubscribeTopic => !unsubscribeTopic.includes(topic.replace('#', '')))
            for (let i = 0; i < this.SubTopicList.length; i++) {
                if (i % 2 === 1) {
                    if (this.SubTopicList[i] === '') {
                        this.SubTopicList.splice(i, 1)
                        i--
                    }
                }
            }

            if (this.$store.state.client.connected) {
                this.$store.state.client.unsubscribe(topic, (error, res) => {
                    if (error) {
                        console.log('Unsubscribe to topics error', error)
                    }
                    if (res) {
                        console.log('Unsubscribe to topics res', res)
                    }
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
            this.qos = qos
        },
        setRetain() {
            this.retain = !this.retain
        },
        setAutoScroll() {
            this.AutoScroll = !this.AutoScroll
        },
        setScan() {
            let topic = '/#'
            let qos = 0
            this.$store.state.client.unsubscribe(topic)
            this.$store.state.client.subscribe(topic, {qos}, (error, res) => {
                if (error) {
                    console.log('Subscribe to ' + topic + ' error', error)
                }
                console.log('Subscribe to ' + topic + ' res', res)
            })

            this.ScanFlag = true
        },
        setStop() {
            this.ScanFlag = false
        },
        manClear(item) {
            if (item === 'Clear All Topics') {
                this.pub_topic = ''
                this.storagePubTopic = []
                localStorage.setItem('PublishTopics', JSON.stringify(this.storagePubTopic))
            } else if (item === "Clear Messages") {
                this.pub_message = ''
            }
        },
        manList(item) {
            if (item === 'Clear') {
                this.ScanTopics = []
            } else if (item === 'Copy') {
                this.$copyText(this.scanTopic).then(function (e) {
                    console.log('Copied', e)
                }, function (e) {
                    console.log('Can not copy', e)
                });
            } else if (item === 'Copy All') {
                let topics = this.ScanTopics.filter(
                    topic => topic !== '')
                this.$copyText(topics.toString()).then(function (e) {
                    console.log('Copied', e)
                }, function (e) {
                    console.log('Can not copy', e)
                });
            }
        },
        onScroll() {
            this.scrollInvoked++
        },
        DumpMessage() {
            alert('To Be Develop')
        },
        manSubClear(item) {
            if (item === 'Clear All Topics') {
                this.sub_topic = ''
                this.storageSubTopic = []
                this.TopicList = ['']
                this.SubTopicList = ['']
                this.SubTopic = null
                this.SelectTopic = null
                localStorage.setItem('SubscribeTopics', JSON.stringify(this.storageSubTopic))
            } else if (item === "Clear Messages") {
                this.sub_message = ''
            }
        },
        RecvTopic_man() {
            if (this.AutoScroll) {
                if (this.SubTopicList.length > 10) {
                    this.SubTopicList.shift()
                    this.msgIndexList.shift()
                    this.SubTopicList.shift()
                    this.msgIndexList.shift()
                }
            }
        }
    },
    watch: {
        'SubTopicList': 'RecvTopic_man'
    },
    mounted() {
        EventBus.$on('mqttConnection', () => {
            if (this.$store.state.MQTT_CONNECTION_CONNECTED) {
                this.createConnection()
            } else {
                this.destroyConnection()
            }
        });

        try {
            this.storagePubTopic = JSON.parse(this.storagePubTopic)
        } catch (e) {
            this.storagePubTopic = []
        }

        try {
            this.storageSubTopic = JSON.parse(this.storageSubTopic)
        } catch (e) {
            this.storageSubTopic = []
        }
    },
    beforeDestroy() {
        this.destroyConnection()
    }
}
</script>
