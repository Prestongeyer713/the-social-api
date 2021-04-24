const { User } = require('../models')

const userController = {
    getAllUsers(req, res) {
        User.find({})
          .populate({
            path: "thoughts",
            select: "-__v",
          })
          .select("-__v")
          .sort({ _id: -1 })
          .then((dbUserData) => res.json(dbUserData))
          .catch((err) => {
            console.log(err);
            res.status(400).json(err);
          });
      },
    
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
           .populate({
               path: 'thoughts',
               select: '-__v'
            })
            .populate ({
                path: 'friends',
                select: '-__v'
            })
           .select('-__v')
           .then(dbUserData => res.json(dbUserData))
           .catch(err => {
               console.log(err)
               res.status(500).json(err)
        });
     },

     createUser({ body }, res) {
         User.create(body)
         .then(dbUserData => res.json(dbUserData))
         .catch(err => res.status(400).json(err));
     },

     addFriend(req, res) {
      console.log(``);
      console.log("\x1b[33m", "client request to add a friend", "\x1b[00m");
      console.log(``);
      console.log(req.params);
      User.findOneAndUpdate
      (
        { _id: req.params.id },
        { $push: { friends: req.params.friendId } },
        { new: true }
      )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({message: `no user found with the id of ${req.params.id}`});
        }
        res.status(200).json(dbUserData);
      })
      .catch(e => { console.log(e); res.status(500).json(e); });
    },

     updateUser({ params, body}, res) {
         User.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true})
         .then(dbUserData => {
             if (!dbUserData) {
                 res.status(404).json({ message: 'No user found with this ID Found!' });
                 return;
             }
             res.json(dbUserData);
         })
            .catch(err => res.json(err))
     },

     deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
          .then((dbUserData) => {
            if (!dbUserData) {
              res.status(404).json({ message: "no user found with this ID Found" });
              return;
            }
            res.json(dbUserData);
          })
          .catch((err) => res.status(400).json(err));
      },

      removeFriend(req, res) {
        console.log(``);
        console.log("\x1b[33m", "client request to add a friend", "\x1b[00m");
        console.log(``);
        console.log(req.params);
        User.findOneAndUpdate
        (
          { _id: req.params.id },
          { $pull: { friends: req.params.friendId } },
          { new: true }
        )
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({message: `no user found with the id of ${req.params.id}`});
          }
          res.status(200).json(dbUserData);
        })
        .catch(e => { console.log(e); res.status(500).json(e); });
      }
    };

module.exports = userController