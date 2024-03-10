module.exports = {
    apps: [{
        name: "VEHICLE_BOOKING",
        script: "./index.js",
        watch: true,
        ignore_watch: ["logs/*", "public/*", "chartdata/*", "uploads/*"],
        out_file: "./logs/out.log",
        output: './logs/out.log',
        error: './logs/error.log',
        log: './logs/combined.outerr.log',

        node_args: '--max_old_space_size=16000',
        ignore_watch: ["./node_modules", "./logs/err.log", "./logs/out.log", "./logs/combined.outerr.log", "./logs/error.log"],
        env_prod: {
            NODE_ENV: "prod",
        },
        env: {
            NODE_ENV: "local",
        }
    }]
};