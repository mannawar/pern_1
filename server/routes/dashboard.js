const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");

//create a new article(only logged in user1)
router.post("/article?", authorize, async(req, res) => {
  try {
    console.log(req.user);
    const { title, description, image } = req.body;
    const newarticle = await pool.query("INSERT INTO newslistings (user_id, title, description, image) VALUES($1, $2, $3, $4) RETURNING *", [req.user, title, description, image])
    res.json(newarticle.rows[0]);
  } catch (err) {
    console.error(err.message)
  }
})

//update a news article(only logged in user)
router.patch("/update/:id?", authorize,async(req, res) => {
  try {
    const {id} = req.params;
    const { title, description, image } = req.body;
    const updateNewsfeed = await pool.query("UPDATE newslistings SET title = $1, description = $2, image = $3 WHERE news_id = $4 AND user_id = $5 RETURNING *" , [title, description, image, id, req.user]);

    if(updateNewsfeed.rows.length === 0) {
      return res.json("This todo is not yours")
    }

    res.json("newslistings table is updated");

  } catch (err) {
    console.error(err.message)
  }
})

//delete
router.delete("/del/:id?", authorize, async(req, res) => {
  try {
    const { id } = req.params;
    const deletenewnews = await pool.query("DELETE FROM newslistings WHERE news_id = $1 AND user_id = $2 RETURNING *", [id, req.user]);

    if( deletenewnews.rows.length === 0) {
      return res.json("The newslisting is not yours");
    }

    res.json(`entries for the id ${id} was deleted`) 
  } catch (err) {
    console.error(err.message);
  }
})

//news listing (only logged in user1)(GET)
router.get("/artdet", authorize ,async(req, res) => {
  try {
    const newslisting = await pool.query("SELECT title FROM newslistings");
    console.log(newslisting);
    res.json(newslisting.rows);
  } catch (err) {
    console.error(err.message)
  }
})


//get news article detail(only logged in user1)
router.get("/artdet/:id?", authorize ,async(req, res) => {
  try {
    const { id } = req.params;
    const articleDetails = await pool.query("SELECT description FROM newslistings WHERE news_id = $1", [id]);
    console.log(articleDetails);
    res.json(articleDetails.rows);
  } catch (err) {
    console.error(err.message)
  }
})

module.exports = router;
