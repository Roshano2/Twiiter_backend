import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

//create user
router.post('/', async (req,res) => {
    const {email,name,username} = req.body;

    try {
        
        const result = await prisma.user.create({
            data : {
                email,
                name,
                username,
                bio: "Hello, this is twitter",
            }
        });
    
    
    res.json(
        result
    );

    }
    catch(e){
        res.status(400).json({
            error : "username and email should be unique"
        })
    }
});

//get all user
router.get('/', async (req,res)=>{
    const allUser = await prisma.user.findMany();
    res.json(
        allUser
    );
});

//get one user
router.get('/:id', async (req,res) => {
    const {id} = req.params;
    const user = await prisma.user.findUnique({where: {id:Number(id)}})
    if(!user) {
        res.status(404).json({
            error : "user not found",
        })
    }
    res.json(
        user
    );
});

//update user
router.put('/:id', async (req,res)=> {
    const {id} = req.params;
    const {bio,name,image} = req.body;
    
    try {
        const result = await prisma.user.update({
            where : {id: Number(id)},
            data : {bio,name,image},
        });
        res.json(result);
    }
    catch(e){
        res.status(400).json({
            error : "Failed to Update"
        })
    }

    res.status(501).json({
        error : `not implemented: ${id}`
    });
});

//delete user
router.delete('/:id', async (req,res)=> {
    const {id} = req.params;
    await prisma.user.delete({where : {id : Number(id)}})
    res.sendStatus(200);

});


export default router;