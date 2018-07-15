const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient();

exports.getImageData = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const image = request.body.imageURL || JSON.parse(request.body).imageURL;
    console.log("image: ", image);
    client
      .safeSearchDetection(image)
      .then(results => {
        console.log("results: ", results);
        const detections = results[0].safeSearchAnnotation;
        const { adult, racy, violence } = detections;
        return response.send({
          adult,
          racy,
          violence
        });
      })
      .catch(ex => {
        // console.log(ex);
        // response.status(400).send("Bad Request");
        return response.send(JSON.stringify(ex));
      });
  });
});
