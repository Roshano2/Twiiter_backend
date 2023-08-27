import { Router } from "express";

const router = Router();

//create tweet
router.post('/', (req,res) => {
    res.status(501).json({
        error : 'not implemented'
    });
});

//get one tweet
router.get('/:id', (req,res) => {
    const {id} = req.params;

    res.status(501).json({
        error : `not implemented: ${id}`
    });
});

//update tweet
router.put('/:id', (req,res)=> {
    const {id} = req.params;

    res.status(501).json({
        error : `not implemented: ${id}`
    });
});

//delete tweet
router.delete('/:id', (req,res)=> {
    const {id} = req.params;

    res.status(501).json({
        error : `not implemented: ${id}`
    });

});


export default router;