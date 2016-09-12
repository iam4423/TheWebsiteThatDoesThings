/**
 * Created by 4423 on 12/09/2016.
 */
requirejs.config({
    baseUrl: "lib/js",
    paths: {
        app: "app",
        jquery: 'jquery-3.1.0'
    },
});

requirejs(["app/main"]);