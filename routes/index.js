
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.dial = function(req, res){
  res.render('dial');
};

exports.bars = function(req, res){
  res.render('bars');
};