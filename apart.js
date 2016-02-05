"use strict";

var _ = require("lodash"),
	ObjectID = require("mongodb").ObjectID,
	turfInside = require("turf-inside"),
	turfPoint = require("turf-point"),
	turfPolygon = require("turf-polygon"),
	database = require("./database"),
	match = require("./match"),
	boroughs = require("./boroughs");

// Construct a turf polygon for each borough.
_.forEach(boroughs, function(borough, key) {
	var turfCoords = _.map(borough.coord, function(coord) {
		return [coord.lng, coord.lat];
	});

	borough.turfPolygon = turfPolygon([turfCoords], {
		name: key
	});
});

var getBoroughName = function(coord) {
	var borough = _.find(boroughs, function(b) {
		return turfInside(turfPoint(coord), b.turfPolygon);
	});

	return borough !== undefined ? borough.turfPolygon.properties.name : "Montreal";
};

var normalizeApart = function(apart) {
	apart._id = new ObjectID(apart._id);
	apart.date = new Date(apart.date);
	apart.last = new Date();
	apart.borough = getBoroughName(apart.coord);
};

module.exports.addOrUpdateApart = function(req, res) {
	normalizeApart(req.body);

	database.apartments.updateOne({
			_id: req.body._id
		}, req.body, {
			upsert: true
		},
		function(err) {
			if (err) {
				res.sendStatus(500);
			} else {
				res.end();
				match.computeScoreApartement(req.body);
			}
		}
	);
};

module.exports.deactivateApart = function(req, res) {
	database.apartments.updateOne({
		_id: new ObjectID(req.body._id)
	}, {
		$set: {
			active: false
		}
	}, function(err) {
		if (err) {
			console.log(err);
			res.sendStatus(500);
		} else {
			res.end();
		}
	});
};

module.exports.getApart = function(req, res) {
	database.apartments.findOne({
		_id: new ObjectID(req.params.id),
	}, function(err, doc) {
		if (err) {
			console.log(err);
			res.sendStatus(404);
		} else {
			res.json(doc);
		}
	});
};

module.exports.getStaffPicks = function(req, res) {
	database.apartments.find({
		active: true,
	}).sort({
		"date": -1
	}).limit(50).toArray(function(err, docs) {
		if (err) {
			console.log(err);
		} else {
			res.json(docs);
		}
	});
};
