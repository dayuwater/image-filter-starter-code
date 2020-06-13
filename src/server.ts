import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Router, Request, Response } from 'express';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // https://timedotcom.files.wordpress.com/2019/03/kitten-report.jpg
  // http://t7.baidu.com/it/u=378254553,3884800361&fm=79&app=86&f=JPEG?w=1280&h=2030
  // https://timn-test-website-bucket.s3-us-west-2.amazonaws.com/img/van-336606_1280.jpg

  app.get( "/filteredimage", async ( req:Request, res:Response ) => {
    const imageUrl = req.query.image_url
    if(!imageUrl){
      res.status(400).send("You must enter a valid image url as query parameter")
    }

    try{
      const url = new URL(imageUrl);
    } 
    catch(e){
      res.status(400).send("Malformed url")
    }

    try{
      const resultUrl:string = await filterImageFromURL(imageUrl)
      res.sendFile(resultUrl, async err => {
        await deleteLocalFiles([resultUrl])
      })
     
    }
    catch(e){
      res.status(422).send("Your image cannot be processed")
    }
   
    
  } );

  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();