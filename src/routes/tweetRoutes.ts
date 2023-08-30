import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();
//create tweet
router.post('/', async (req,res) => {
    const {content,image,userId} = req.body;

    try{
        const result = await prisma.tweet.create({
            
            data : {
                content,
                image,
                userId
            },
        });

    res.status(200).json(
        result
    )
    }
    catch(e){
        res.status(400).json({
            error : 'Not a valid tweet'
        });
    }

    
});

//list all tweet
router.get('/', async (req,res) => {
    const allTweets = await prisma.tweet.findMany({
        include : {user : {select : {id : true, name : true, username:true, image: true}}},
    });
    res.json(allTweets);
});

//get one tweet
router.get('/:id', async (req,res) => {
    const {id} = req.params;
    const tweet = await prisma.tweet.findUnique({
        where: {id: Number(id)}, include : { user : true},
    });
    if(!tweet) {
        res.status(404).json({
            error : "tweet not found",
        })
    }
    res.json(tweet);
});

//update tweet
/*
router.put('/:id', async (req,res)=> {
    const {id} = req.params;

    res.status(501).json({
        error : `not implemented: ${id}`
    });
});
*/
//delete tweet
router.delete('/:id', async (req,res)=> {
    const {id} = req.params;
    try{
        await prisma.tweet.delete({where: {id : Number(id)}});
    res.sendStatus(200);
    }
    catch(e)
    {
        res.status(404).json({
            error : "no tweet found to delete",
        })
    }
    
});


export default router;