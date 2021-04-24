const { User, Thought } = require('../models');


const thoughtController = {
    getAllThoughts(req, res) {
      Thought.find({})
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .select("-__v")
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => {
          console.log(err);
          res.status(400).json(err);
        });
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'user',
                select: '-__v'
            })
           .select('-__v')
           .sort({ _id: -1 })
           .then(dbThoughtData => res.json(dbThoughtData))
           .catch(err => {
               console.log(err);
               res.status(500).json(err)
           })
    },

    createThought({ body }, res) {
        console.log(body);
        Thought.create(body)
          .then((thoughtData) => {
            return User.findOneAndUpdate(
              { _id: body.userId },
              { $push: { thoughts: thoughtData._id } },
              { new: true }
            );
          })
          .then((dbUserData) => {
            if (!dbUserData) {
              res.status(404).json({ message: "No User with this ID Found" });
              return;
            }
            res.json(dbUserData);
          })
          .catch((err) => res.json(err));
      },

      addReaction(req, res) {
        console.log(``);
        console.log("\x1b[33m", "client request to add a react to a thought", "\x1b[00m");
        console.log(``);
        console.log(req.params);
        console.log(req.body);
        Thought.findOneAndUpdate
        (
          { _id: req.params.id },
          { $push: { reactions: req.body } },
          { new: true }
        )
        .then(dbThoughtData => {
          console.log(dbThoughtData);
          if (!dbThoughtData) {
            return res.status(404).json({message: `no thought found with the id of ${req.params.thoughtId}`});
          }
          res.status(200).json(dbThoughtData);
        })
        .catch(e => { console.log(e); res.json(500).json(e); });
      },
    

    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              res.status(404).json({ message: "No thought with this ID Found" });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch((err) => res.status(400).json(err));
      },

    deleteThought({ params, body}, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(deletedThought => {
            if (!deletedThought) {
                return res.status(404).json({ message: 'No thought with this ID!'})
            }
            res.json(deletedThought);
        })
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController