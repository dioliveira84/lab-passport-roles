const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const User = require("../models/user");
const ensureLogin = require("connect-ensure-login");
const roles = require("../middlewares/roles");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("home");
});

router.use(ensureLogin.ensureLoggedIn());

router.get("/courses", (req, res, next) => {
  let staff = false;

  Course.find({})
    .then(courses => {
      if (req.user.role == "BOSS" || req.user.role == "TA") {
        staff = true;
        res.render("courses", { courses, staff, currentUser: req.user });
      } else {
        res.render("courses", { courses, currentUser: req.user });
      }
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/course/add", roles.checkStaff(), (req, res, next) => {
  res.render("course-add");
});

router.post("/course/add", (req, res, next) => {
  let { name, description } = req.body;

  const newCourse = new Course({ name, description });

  newCourse
    .save()
    .then(course => {
      res.redirect("/courses");
    })
    .catch(err => {
      throw new Error(err);
    });
});

router.get("/course/edit", (req, res, next) => {
  let staff = false;

  Course.findOne({ _id: req.query.course_id })
    .then(course => {
      if (req.user.role == "BOSS" || req.user.role == "TA") {
        staff = true;
        res.render("course-edit", { course });
      } else {
        res.redirect(`/course/${course._id}`);
      }
    })
    .catch(error => {
      console.log(error);
    });
});

router.post("/course/edit", (req, res, next) => {
  let { name, description } = req.body;

  Course.update(
    { _id: req.query.course_id },
    { $set: { name, description } },
    { new: true }
  )
    .then(course => {
      res.redirect("/courses");
    })
    .catch(err => {
      throw new Error(err);
    });
});

router.post("/course/delete", (req, res, next) => {
  let courseId = req.body.id;
  Course.deleteOne({ _id: courseId })
  .then(course => {
    res.redirect("/courses")
  })
  .catch(err => {
    throw new Error(err);
  })
});

router.get("/course/:id", (req, res, next) => {
  let courseId = req.params.id;
  if (!/^[0-9a-fA-F]{24}$/.test(courseId)) {
    return res.status(404).render("not-found");
  }

  Course.findOne({ _id: courseId })
    .then(course => {
      // res.send(course);
      res.render("course-detail", { course });
    })
    .catch(error => {
      console.log(error);
    });
});

router.get('/participants', (req, res, next) => {
  let staff = false;
  
  if(req.user.role == "STUDENT"){
  User.find({role: "STUDENT" })
    .then(users => {
      res.render('participants', {users, staff, currentUser:req.user});
    })
    .catch(error => {
      console.log(error);
    }) 
  }
  else {
    User.find({})
    .then(users => {
      if(req.user.role == "BOSS"){
        staff = true;
      }
      res.render('participants', {users, staff, currentUser:req.user});
    })
    .catch(error => {
      console.log(error);
    }) 
  }
    
  
  
    


  // User.find()
  //   .then(users => {
  //     if(req.user.role == "STUDENT") {
  //       Users.find({role: "STUDENT" })
  //       res.render('participants', {users})
  //   } else {
  //     Users.find({})
  //     boss = true;
  //     res.render('participants', {users})
  //   }
  // ;
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   })
  });
  
  router.get("/profile/edit", (req, res, next) => {

let notBoss = false;

    User.findOne({ _id: req.query.user_id })
    .then(user => {
     if(req.user.role != "BOSS"){
       notBoss = true;
       res.render("profile-edit", { user, notBoss });
     }  else {
      let staff = true;
      res.render("profile-edit", { user, notBoss, staff });
     }
 
    })
    .catch(error => {
      console.log(error);
    });
  });

  router.post("/profile/edit", (req, res, next) => {

    if (req.user.role != "BOSS") {
      let { name } = req.body;
    

      User.update(
        { _id: req.query.user_id },
        { $set: { name }},
        { new: true }
      )
        .then(course => {
          res.redirect("/participants");
        })
        .catch(err => {
          throw new Error(err);
        });
   
    } else {
      let { name, role } = req.body;
    

      User.update(
        { _id: req.query.user_id },
        { $set: { name, role }},
        { new: true }
      )
        .then(course => {
          res.redirect("/participants");
        })
        .catch(err => {
          throw new Error(err);
        });
 
    }
    
    });

    router.post("/profile/delete", (req, res, next) => {
      let profileId = req.body.id;
      User.deleteOne({ _id: profileId })
      .then(profile => {
        res.redirect("/participants")
      })
      .catch(err => {
        throw new Error(err);
      })
    });
    
    router.get("/profile/add", roles.checkBoss(), (req, res, next) => {
    res.render("profile-add");
    });

module.exports = router;
