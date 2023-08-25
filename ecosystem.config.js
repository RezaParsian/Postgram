module.exports = {
    apps:[
        // {
        //     name: "NodeTs",
        //     script: "npx ts-node main.ts",
        //     exp_backoff_restart_delay: 5000,
        //     restart_delay: 5000,
        // },
        {
            name: "NodeTs",
            script: "npx nodemon main.ts",
            watch:false,
            exp_backoff_restart_delay: 5000,
            restart_delay: 5000,
        },
    ]
};
