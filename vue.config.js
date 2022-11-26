module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            // List native deps here if they don't work
            // If you are using Yarn Workspaces, you may have multiple node_modules folders
            // List them all here so that VCP Electron Builder can find them
            nodeModulesPath: ['../../node_modules', './node_modules'],
            builderOptions: {
                // options placed here will be merged with default configuration and passed to electron-builder
                appId: 'kr.re.keti.app',
                productName: "MQTT-Vue",
                mac: {
                    icon: "./public/icon.png",
                    target: [
                        {
                            target: "default"
                        }
                    ],
                    publish: ["github"]
                },
                dmg: {
                    title: "MQTT-Vue"
                },
                win: {
                    icon: "./public/icon.png",
                    target: [
                        {
                            target: "nsis",
                            arch: ["x64", "ia32"]
                        }
                    ],
                    publish: ["github"]
                },
                nsis: {
                    oneClick: false,
                    perMachine: true,
                    allowToChangeInstallationDirectory: true
                },
                publish: [
                    {
                        provider: "github",
                        owner: "dnjstjr93",
                        repo: "MQTT-Vue",
                        vPrefixedTagName: true,
                        channel: "latest",
                        private: true,
                        token: process.env.GH_TOKEN
                    }
                ]
            }
        }
    }
}
