/**
 * Created by 4423 on 12/09/2016.
 */
define(function() {
   return {
       loadCss: function(path)
       {
           var style = document.createElement("link");
           style.rel = "stylesheet";
           style.href = path + ".css";

           document.getElementsByTagName("head")[0].appendChild(style);
       }
   };
});