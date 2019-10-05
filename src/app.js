import request from "request";
import yargs from "yargs";


const url = "https://api.darksky.net/";
const token = "4462cc7ab9b441fab460316880d97df5/";
const endPoint = `${url}forecast/${token}`;

let index = undefined;
const urlmb ="https://api.mapbox.com/geocoding/v5/mapbox.places/";
const tokenmb ="pk.eyJ1Ijoic3BldHJvdmFzIiwiYSI6ImNrMWFvMGw0bzI3aWYzbnBmaGo1a3h5cnIifQ.zkSbIDBg96twgA9TKN9rsw";
let ubi = "";

const config ={
    url: "",
    json : true,
};

const callback = (error, response)=> {
    (response.body.features).forEach((elem, i) => {
        if(index === undefined || index === i ){
            request({url: `${endPoint}${elem.center[1]},${elem.center[0]}?units=si`, json: true},(error,response2) =>{
                console.log(`el tiempo en: ${elem.place_name} es:`);
                console.log(`temperatura: ${response2.body.currently.temperature}C`);
                console.log(`probabilidad de precipitación: ${response2.body.currently.precipProbability}%`);
            });
        }
    });
}

yargs.command({
    command: "localization",
    define: "search the localization and return his coordinates",
    builder: {
        name:{
            define:"name of the place",
            demmandOption: true,
            type: "string",
        },
        index:{
            define: "the position of the place in the array",
            demmandOption: false,
            type: "int",
        },
    },
    handler: (args) => {
        ubi = args.name;
        index = args.index;
        config.url = `${urlmb}${ubi}.json?access_token=${tokenmb}`;
        request(config,callback);
    },
});

yargs.parse();