var Sequence = require('../models/sequence');

var maxDocumentId;
var maxMessageId;
var maxContactId;
var sequenceId = null;

function SequenceGenerator() {
  Sequence.findOne()
    .exec()
    .then(sequence => {
      sequenceId = sequence._id;
      maxDocumentId = sequence.maxDocumentId;
      maxMessageId = sequence.maxMessageId;
      maxContactId = sequence.maxContactId;
    })
    .catch((err) => {
      console.error('SequenceGenenerator error:', err);
      // res.status(500).json({
      //   title: 'An error occurred!',
      //   error: err
      // })
    });
}
// function SequenceGenerator() {

//   Sequence.findOne()
//     .exec(function(err, sequence) {
//       if (err) {
//         return res.status(500).json({
//           title: 'An error occurred',
//           error: err
//         });
//       }

//       sequenceId = sequence._id;
//       maxDocumentId = sequence.maxDocumentId;
//       maxMessageId = sequence.maxMessageId;
//       maxContactId = sequence.maxContactId;
//     });
// }

SequenceGenerator.prototype.nextId = function(collectionType) {

  var updateObject = {};
  var nextId;

  switch (collectionType) {
    case 'documents':
      maxDocumentId++;
      updateObject = {maxDocumentId: maxDocumentId};
      nextId = maxDocumentId;
      break;
    case 'messages':
      maxMessageId++;
      updateObject = {maxMessageId: maxMessageId};
      nextId = maxMessageId;
      break;
    case 'contacts':
      maxContactId++;
      updateObject = {maxContactId: maxContactId};
      nextId = maxContactId;
      break;
    default:
      return -1;
  }

  Sequence.updateOne({_id: sequenceId}, {$set: updateObject})
    .catch(err => console.error('nextId error =', err));
  // Sequence.updateOne({_id: sequenceId}, {$set: updateObject},
  //   function(err) {
  //     if (err) {
  //       console.log("nextId error = " + err);
  //       return null
  //     }
  //   });

  return nextId;
}

module.exports = new SequenceGenerator();
