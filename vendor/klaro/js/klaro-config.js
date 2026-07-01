// minimum required configuration, without all options you find in the config template from klaro
var klaroConfig = {

    storageMethod: 'localStorage',

    default: false,

    acceptAll: true,

    translations: {
        en: {

            privacyPolicyUrl: '/privacy.html',
            purposes: {
                analytics: {title: 'Access Statistics'}
            }
        }
    },

    services: [
        {
            name: 'google-analytics',
            title: 'Google Analytics',
            purposes: ['analytics'],
            cookies: [
                /^_ga$/,
                /^_ga_/,
                /^_gid$/,
                /^_gat/
            ]
        }
    ]

};