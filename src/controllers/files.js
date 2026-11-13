const File = require('../models/filestore.js');

const uploadPage = (req, res) => {
  res.render('upload');
};

const uploadFile = async (req, res) => {
  if(!req.files || !req.files.sampleFile){
    return res.status(400).json({error: "No files were uploaded"});
  }

  console.log(req.files);
  const {sampleFile} = req.files;

  try{
    const newFile = new File(sampleFile);
    const doc = await newFile.save();
    return res.status(201).json({message: "file store successful", fileId: doc._id});
  } catch {
    console.log(err);
    return res.status(400).json({error: 'something went wrong in file upload and you have an error'});
  }
};

// 6af4c1a8957d8a175dc63aaa

const retrieveFile = async (req, res) => {
  if(!req.query._id){
    return res.status(400).json({error: "missing file ID"});
  }

  let doc;
  try{
    doc = await File.findOne({_id: req.query._id}).exec();
  }catch{
    console.log(err);
    return res.status(400).json({error: 'something went wrong in file retrieving and you have an error'});
  }

  if(!doc){
    return res.status(400).json({error: 'file not found'});
  }

  res.set({
    'Content-Type':doc.mimeType,
    'Content-Length':doc.size,
    'Content-Disposition': `inline; filename="${doc.name}"`,
  });

  res.send(doc.data);

};

module.exports = {
  uploadPage,
  uploadFile,
  retrieveFile
}