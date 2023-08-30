import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = "SUPER SECRET";

function generateEmailToken() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function generateAuthToken(tokenId : number) : string {
    const jwtPayload = { tokenId };

    return jwt.sign(jwtPayload, JWT_SECRET, {
        algorithm : 'HS256',
        noTimestamp : true,
    })
}

//login by creating a user if doesnt exist
router.post('/login', async (req,res) => {
    const {email} = req.body;

    //here generate tokens from
    const emailToken = generateEmailToken();
    const expiration = new Date(
        new Date().getTime() + 10*60*1000
    );

    try{
        const createdToken = await prisma.token.create({
        
            data : {
                type : "EMAIL",
                emailToken,
                expiration,
                user : {
                    connectOrCreate : {
                        where : {email},
                        create : {email},
                    }
                }
            },
        });
    
        console.log(createdToken);
        res.json(createdToken);
        //there was an error here
        //res.sendstatus.json() did not work properly and the it was not returning properly
        //once i removed the 'sendstatus' it was working properly
        //the error was - "Cannot set headers after they are sent to the client"
    }
    catch(e)
    {
        console.log(e);
        res.status(400).json({
            error : "authentication could not start",
        })
    }
    
});


//authenticate
// validate the emailToken

router.post('/authenticate', async (req,res) => {
    const {email,emailToken} = req.body;
    console.log(email,emailToken);

    const dbEmailToken = await prisma.token.findUnique({
        where : {emailToken},
        include : { user: true}
    })

    

    //validation processssssss
    if(!dbEmailToken || !dbEmailToken.valid) {
        return res.sendStatus(401);
    }// token is present or token is valid here

    if(dbEmailToken.expiration < new Date()) {
        return res.status(401).json({
            error :  "token expired"
        });
    }// token time is below the specific time period of expiration

    if(dbEmailToken?.user?.email != email) {
        return res.sendStatus(401);
    }// email given by user is present validation

    console.log(dbEmailToken);

    //here we validate that the user is the owner of the email

    // generate an API token
    const expiration = new Date(
        new Date().getTime() + 12*60*60*1000 // hours x min x sec x millisec
    );
    const apiToken = await prisma.token.create({
        data : {
            type : 'API',
            expiration,
            user : {
                connect : {
                    email
                }
            }
        },
    });

    await prisma.token.update({
        where : {id : dbEmailToken.id},
        data : {valid : false},
    });

    // to generate the jwt token here
    const authToken = generateAuthToken(apiToken.id);

    


    res.json(authToken);

})

export default router;