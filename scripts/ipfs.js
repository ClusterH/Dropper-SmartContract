import fs from 'fs'
import path from 'path'
import pinataSDK from '@pinata/sdk';

const folderName = "Clix NFT Project";

const IPFS = true;
const apiKey = '67eceb2ef71502c2d726'
const apiSecret = '75a2cf52177dee5e73fb9222f5e0a9182cb28274801415e6929cbe95ed43354f'
const secretAccesstoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwODEyOTgxNC1iYzcwLTRhZDQtOTI4Yy1kZTQ4ZDIxODkxNjYiLCJlbWFpbCI6ImxhdXJhQHRoZXJlYWxtLmdnIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZX0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjY3ZWNlYjJlZjcxNTAyYzJkNzI2Iiwic2NvcGVkS2V5U2VjcmV0IjoiNzVhMmNmNTIxNzdkZWU1ZTczZmI5MjIyZjVlMGE5MTgyY2IyODI3NDgwMTQxNWU2OTI5Y2JlOTVlZDQzMzU0ZiIsImlhdCI6MTYzNDY4OTk3MX0.GMaTy4SbNZinPspSItjxZQelMobzwzNqiCtEpLS2r3Y'
const pinata = pinataSDK(apiKey, apiSecret);


const dir = path.join(path.resolve(),folderName);

async function main() {
    
    fs.readdir(dir, async function (err, rarity) {
        if (err) {
            return console.log("Unable to read folders in directory: " + err);
        }
        fs.mkdir(path.join(path.resolve(), "metadata"), (err) => {
            if (err) {
                if (err.errno == -17){
                    //console.log("Metadata already exists");
                } else return console.error(err)
            }
        });

        rarity.forEach(async function (rarityName) {

            fs.mkdir(path.join(path.resolve(), ("metadata/" + rarityName)), (err) => {
                if (err) {
                    if (err.errno == -17){
                        //console.log("Metadata already exists");
                    } else return console.error(err)
                }
            });
            
            fs.readdir(path.join(dir, rarityName), async function (err, moments) {
                if (err) {
                    return console.log("Unable to read folders in directory: " + err);
                }

                var i = 0
                moments.forEach(async function (moment) {

                    if (moment.slice(-4) == ".mp4") {
                        setTimeout(function logic() {
                            var name = moment.slice(0,-4)
                            var rarity = rarityName

                            if (IPFS) {
                                //var imagePath = path.join(path.join(dir,rarityName),name) + ".png"
                                //var videoPath = path.join(path.join(dir,rarityName),name) + ".mp4"
                                //var imageStream = fs.createReadStream(imagePath)
                                //var videoStream = fs.createReadStream(videoPath)
                                var pinataGateway = 'https://dropper.mypinata.cloud/ipfs/QmRricfYLZPBzKK2rSk6ktMHS21HJD28xNtwkfLWpkbnTo'
                                pinataGateway = path.join(path.join(pinataGateway, rarity), name.replace(/ /g, "%20"))

                                var image = pinataGateway + '.png'
                                var video = pinataGateway + '.mp4'


                            } else {
                                var awsPath = "https://clixnfts.s3.us-east-2.amazonaws.com/"
                                var image = path.join(path.join(awsPath, rarity), (name + ".png"))
                                var video = path.join(path.join(awsPath, rarity), (name + ".mp4"))
                            }

                            var metadata = ({
                                name: name,
                                description: "A piece of Clix history",
                                external_url: 'https://www.joindropper.com',
                                attributes: [
                                    {
                                        "trait_type": "Collection",
                                        "value": "Clix #1"
                                    },
                                    {
                                        "trait_type": "Rarity",
                                        "value": rarity
                                    },
                                    {
                                        "trait_type": "Title",
                                        "value": "Fortnite"
                                    },
                                    {
                                        "trait_type": "Genre",
                                        "value": "Battle Royale"
                                    },
                                    {
                                        "trait_type": "Platform",
                                        "value": "Twitch.tv"
                                    },
                                    {
                                        "trait_type": "Twitter",
                                        "value": "@ClixHimself"
                                    },
                                    
                                ],
                                image: image,
                                animation_url: video
                            })

                            var filePath = path.join(path.resolve(), ("metadata/" + rarity)) + "/" + name + ".json"
                            fs.writeFile(filePath, JSON.stringify(metadata, null, 2), err => {
                                if (err) {
                                    if (err.errno == -17){
                                        //console.log("Metadata already exists");
                                    } else return console.error(err)
                                }
                            });

                            var options = {
                                pinataMetadata:{
                                    name: name
                                },
                                pinataOptions: {
                                    cidVersion: 0
                                }
                            }

                            filePath = path.join(path.resolve(), ("metadata/" + rarity)) + "/" + name + "."
                            
                            pinata.pinJSONToIPFS(metadata, options).then((result) =>{
                                fs.writeFile(filePath + result.IpfsHash, result.IpfsHash, err => {
                                    if (err) {
                                        if (err.errno == -17){
                                            //console.log("Metadata already exists");
                                        } else return console.error(err)
                                    }
                                });
                            }).catch((err) => {
                                console.log(err)
                            })
                        }, i*1000);
                        i += 1;
                    }
                })
            })
        })
    })
}

pinata.testAuthentication().then((result) => {    
    main()   
    console.log(result);
}).catch((err) => {    
    //handle error here    
    console.log(err);
});